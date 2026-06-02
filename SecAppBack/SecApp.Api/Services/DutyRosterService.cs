using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.DTOs.DutyRosterDTOs;
using SecApp.Api.Entities;
using SecApp.Api.Interfaces;
using SecApp.Api.Services.Interfaces;
using System.Text.Json;

namespace SecApp.Api.Services
{
    public class DutyRosterService : IDutyRosterService
    {
        private readonly IBaseRepository<DutyAssignment> _repository;
        private readonly IBaseRepository<WeeklyRoster> _archiveRepository;
        private readonly IBaseRepository<DepartmentResponsible> _respRepository;
        private readonly IAuditService _auditService;
        private readonly IMapper _mapper;

        public DutyRosterService(
            IBaseRepository<DutyAssignment> repository, 
            IBaseRepository<WeeklyRoster> archiveRepository,
            IBaseRepository<DepartmentResponsible> respRepository,
            IAuditService auditService,
            IMapper mapper)
        {
            _repository = repository;
            _archiveRepository = archiveRepository;
            _respRepository = respRepository;
            _auditService = auditService;
            _mapper = mapper;
        }

        public async Task<List<DutyAssignmentDTO>> GetRosterByWeek(DateTime startDate)
        {
            var archived = await _archiveRepository.GetAll()
                .FirstOrDefaultAsync(r => r.StartDate.Date == startDate.Date && r.IsClosed);

            if (archived != null && !string.IsNullOrEmpty(archived.SnapshotData))
            {
                return JsonSerializer.Deserialize<List<DutyAssignmentDTO>>(archived.SnapshotData) ?? new List<DutyAssignmentDTO>();
            }

            var assignments = await _repository.GetAll()
                .Where(a => a.WeekStartDate.Date == startDate.Date)
                .Include(a => a.Agent).ThenInclude(ag => ag!.Rank).ThenInclude(r => r!.Institution)
                .Include(a => a.Shift)
                .Include(a => a.DutyPost)
                .ToListAsync();

            return _mapper.Map<List<DutyAssignmentDTO>>(assignments);
        }

        public async Task<WeeklyRosterDTO?> GetRosterStatus(DateTime startDate)
        {
            var archived = await _archiveRepository.GetAll()
                .FirstOrDefaultAsync(r => r.StartDate.Date == startDate.Date);
            
            return _mapper.Map<WeeklyRosterDTO>(archived);
        }

        private async Task<bool> IsRosterClosed(DateTime startDate)
        {
            return await _archiveRepository.GetAll().AnyAsync(r => r.StartDate.Date == startDate.Date && r.IsClosed);
        }

        public async Task<WeeklyRosterDTO> CloseRoster(DateTime startDate)
        {
            if (await IsRosterClosed(startDate)) throw new InvalidOperationException("La guardia ya está cerrada.");

            var assignments = await GetRosterByWeek(startDate);
            if (!assignments.Any()) throw new Exception("No se puede cerrar una guardia sin asignaciones.");

            var responsibles = await _respRepository.GetAll().Where(r => r.IsActive).ToListAsync();
            var subEnc = responsibles.FirstOrDefault(r => r.Position == "Sub-Encargado");
            var enc = responsibles.FirstOrDefault(r => r.Position == "Encargado");

            var archive = new WeeklyRoster
            {
                StartDate = startDate.Date,
                IsClosed = true,
                ClosedAt = DateTime.Now,
                PreparerName = subEnc?.FullName,
                PreparerRank = subEnc?.Rank,
                ApproverName = enc?.FullName,
                ApproverRank = enc?.Rank,
                SnapshotData = JsonSerializer.Serialize(assignments)
            };

            await _archiveRepository.Insert(archive);

            await _auditService.LogActionAsync("Cierre de Guardia", "WeeklyRoster", startDate.ToString("yyyy-MM-dd"), $"Guardia del {startDate:dd/MM/yyyy} cerrada oficialmente.");

            return _mapper.Map<WeeklyRosterDTO>(archive);
        }

        public async Task ReopenRoster(DateTime startDate)
        {
            var archived = await _archiveRepository.GetAll()
                .FirstOrDefaultAsync(r => r.StartDate.Date == startDate.Date);
            
            if (archived != null)
            {
                await _archiveRepository.Delete(archived.Id);
                await _auditService.LogActionAsync("Reapertura de Guardia", "WeeklyRoster", startDate.ToString("yyyy-MM-dd"), $"Guardia del {startDate:dd/MM/yyyy} reabierta para edición.");
            }
        }

        public async Task<List<DateTime>> GetRecentRostersDates()
        {
            var archivedDates = await _archiveRepository.GetAll()
                .Select(r => r.StartDate)
                .ToListAsync();

            var assignmentDates = await _repository.GetAll()
                .Select(a => a.WeekStartDate)
                .Distinct()
                .ToListAsync();

            return archivedDates.Union(assignmentDates)
                .Select(d => d.Date)
                .Distinct()
                .OrderByDescending(d => d)
                .Take(15)
                .ToList();
        }

        public async Task CloneRoster(DateTime fromDate, DateTime toDate)
        {
            if (await IsRosterClosed(toDate)) throw new InvalidOperationException("La fecha destino ya tiene una guardia cerrada.");
            
            var sourceAssignments = await _repository.GetAll()
                .Where(a => a.WeekStartDate.Date == fromDate.Date)
                .ToListAsync();

            if (!sourceAssignments.Any()) return;

            var existingInToDate = await _repository.GetAll()
                .Where(a => a.WeekStartDate.Date == toDate.Date)
                .ToListAsync();

            foreach(var item in existingInToDate)
            {
                await _repository.Delete(item.Id);
            }

            foreach(var source in sourceAssignments)
            {
                var newAssignment = new DutyAssignment
                {
                    WeekStartDate = toDate.Date,
                    AgentId = source.AgentId,
                    ShiftId = source.ShiftId,
                    DutyPostId = source.DutyPostId
                };
                await _repository.Insert(newAssignment);
            }

            await _auditService.LogActionAsync("Clonación de Guardia", "DutyAssignment", toDate.ToString("yyyy-MM-dd"), $"Se clonó la guardia desde {fromDate:dd/MM/yyyy} hacia {toDate:dd/MM/yyyy}.");
        }

        public async Task<DutyAssignmentDTO> AssignAgent(DutyAssignmentCreateDTO assignmentDTO)
        {
            if (await IsRosterClosed(assignmentDTO.WeekStartDate)) throw new InvalidOperationException("No se puede editar una guardia cerrada.");
            
            // 1. Validar que el agente no esté asignado a otro puesto en la misma fecha
            var agentAlreadyAssigned = await _repository.GetAll()
                .AnyAsync(a => a.WeekStartDate.Date == assignmentDTO.WeekStartDate.Date && a.AgentId == assignmentDTO.AgentId);
            
            if (agentAlreadyAssigned)
            {
                throw new InvalidOperationException("El agente ya está asignado a un puesto en este día.");
            }

            // 2. Validar que el puesto no tenga ya un agente en el mismo turno y fecha
            var postAlreadyFilled = await _repository.GetAll()
                .AnyAsync(a => a.WeekStartDate.Date == assignmentDTO.WeekStartDate.Date && 
                               a.ShiftId == assignmentDTO.ShiftId && 
                               a.DutyPostId == assignmentDTO.DutyPostId);
            
            if (postAlreadyFilled)
            {
                throw new InvalidOperationException("El puesto ya tiene un oficial asignado para este turno.");
            }

            var assignment = _mapper.Map<DutyAssignment>(assignmentDTO);
            await _repository.Insert(assignment);
            
            var result = await _repository.GetAll()
                .Include(a => a.Agent).ThenInclude(ag => ag!.Rank).ThenInclude(r => r!.Institution)
                .Include(a => a.Shift)
                .Include(a => a.DutyPost)
                .FirstOrDefaultAsync(a => a.Id == assignment.Id);

            if (result != null)
            {
                await _auditService.LogActionAsync("Asignación de Agente", "DutyAssignment", result.Id.ToString(), $"Agente: {result.Agent?.FullName}, Puesto: {result.DutyPost?.Name}, Turno: {result.Shift?.Name}");
            }

            return _mapper.Map<DutyAssignmentDTO>(result);
        }

        public async Task RemoveAssignment(int id)
        {
            var assignment = await _repository.GetAll()
                .Include(a => a.Agent)
                .Include(a => a.DutyPost)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (assignment != null)
            {
                if (await IsRosterClosed(assignment.WeekStartDate)) 
                    throw new InvalidOperationException("No se puede editar una guardia cerrada.");

                var details = $"Se eliminó la asignación de {assignment.Agent?.FullName} en {assignment.DutyPost?.Name}.";
                await _repository.Delete(id);
                await _auditService.LogActionAsync("Eliminación de Asignación", "DutyAssignment", id.ToString(), details);
            }
        }

        public async Task ClearRoster(DateTime date)
        {
            if (await IsRosterClosed(date)) throw new InvalidOperationException("No se puede vaciar una guardia cerrada.");

            var assignments = await _repository.GetAll()
                .Where(a => a.WeekStartDate.Date == date.Date)
                .ToListAsync();

            foreach (var item in assignments)
            {
                await _repository.Delete(item.Id);
            }

            await _auditService.LogActionAsync("Vaciado de Lista", "DutyAssignment", date.ToString("yyyy-MM-dd"), $"Se eliminaron todas las asignaciones de la semana del {date:dd/MM/yyyy}.");
        }
    }
}

using AutoMapper;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.DTOs.AgentDTOs;
using SecApp.Api.DTOs.CommonDTOs;
using SecApp.Api.Entities;
using SecApp.Api.Interfaces;
using SecApp.Api.Services.Interfaces;
using SecApp.Api.Utilities;

namespace SecApp.Api.Services
{
    public class AgentService : IAgentService
    {
        private readonly IBaseRepository<Agent> _agentsRepository;
        private readonly IOutputCacheStore _outputCache;
        private readonly IMapper _mapper;
        private readonly IFileSaver _fileSaver;

        private const string cacheTag = "agents";
        private readonly string AgentFolderPath = "agents";

        public AgentService(
            IBaseRepository<Agent> agentsRepository,
            IOutputCacheStore outputCache,
            IMapper mapper,
            IFileSaver fileSaver)
        {
            _agentsRepository = agentsRepository;
            _outputCache = outputCache;
            _mapper = mapper;
            _fileSaver = fileSaver;
        }

        public async Task<List<AgentDTO>> GetAgents(PaginationDTO pagination, HttpContext httpContext, bool? status = null)
        {
            var queryable = _agentsRepository.GetAll();

            if (status.HasValue)
            {
                queryable = queryable.Where(a => a.Status == status.Value);
            }

            await httpContext.InsertParamsHeader(queryable);

            var agentsList = await queryable
                .OrderBy(a => a.Name)
                .Pager(pagination)
                .ToListAsync();

            return _mapper.Map<List<AgentDTO>>(agentsList);
        }

        public async Task<AgentDTO?> GetAgentById(int id)
        {
            var agent = await _agentsRepository.GetById(id);
            if (agent is null) return null;

            return _mapper.Map<AgentDTO>(agent);
        }

        public async Task<AgentDTO?> GetAgentByCode(string code)
        {
            // Búsqueda directa sobre el queryable para máxima compatibilidad
            var agent = await _agentsRepository.GetAll()
                .FirstOrDefaultAsync(a => a.AgentCode == code);
            
            if (agent is null) return null;

            return _mapper.Map<AgentDTO>(agent);
        }

        public async Task<AgentDTO?> GetAgentByIdentification(string identification)
        {
            var agent = await _agentsRepository.GetAll()
                .FirstOrDefaultAsync(a => a.Identification == identification);

            if (agent is null) return null;

            return _mapper.Map<AgentDTO>(agent);
        }

        public async Task<List<AgentDTO>> SearchAgents(string query)
        {
            if (string.IsNullOrWhiteSpace(query)) return new List<AgentDTO>();

            var lowerQuery = query.ToLower().Trim();

            // Dividir la consulta en palabras para buscar en nombre y apellido por separado
            var words = lowerQuery.Split(' ', StringSplitOptions.RemoveEmptyEntries);

            var queryable = _agentsRepository.GetAll();

            foreach (var word in words)
            {
                // El agente debe coincidir con todas las palabras buscadas (AND)
                queryable = queryable.Where(a => 
                    a.Name.ToLower().Contains(word) || 
                    a.LastName.ToLower().Contains(word) ||
                    a.Identification.Contains(word) ||
                    a.AgentCode.ToString().Contains(word)
                );
            }

            var agents = await queryable.Take(10).ToListAsync();
            return _mapper.Map<List<AgentDTO>>(agents);
        }

        public async Task<AgentDTO> CreateAgent(AgentCreateDTO agentDTO)
        {
            var agent = _mapper.Map<Agent>(agentDTO);

            if (agentDTO.Photo != null)
            {
                agent.Photo = await _fileSaver.SaveFile(AgentFolderPath, agentDTO.Photo);
            }

            await _agentsRepository.Insert(agent);
            await _outputCache.EvictByTagAsync(cacheTag, default);

            return _mapper.Map<AgentDTO>(agent);
        }

        public async Task UpdateAgent(int id, AgentCreateDTO agentCreateDTO)
        {
            var agentDB = await _agentsRepository.GetById(id);
            if (agentDB == null) throw new KeyNotFoundException("Agente no encontrado.");

            // Guardamos la foto actual antes de que el mapeo la sobrescriba
            var existingPhoto = agentDB.Photo;

            // Mapeamos los datos nuevos sobre el objeto de la DB
            _mapper.Map(agentCreateDTO, agentDB);
            agentDB.Id = id;

            // Si viene una foto nueva, la procesamos. 
            // Si NO viene, restauramos la foto que ya teníamos en la DB.
            if (agentCreateDTO.Photo is not null)
            {
                agentDB.Photo = await _fileSaver.Update(existingPhoto, AgentFolderPath, agentCreateDTO.Photo);
            }
            else
            {
                agentDB.Photo = existingPhoto;
            }

            await _agentsRepository.Update(agentDB);
            await _outputCache.EvictByTagAsync(cacheTag, default);
        }

        public async Task DeleteAgent(int id)
        {
            var agent = await _agentsRepository.GetById(id);
            if (agent == null) throw new KeyNotFoundException("Agente no encontrado.");

            if (!string.IsNullOrEmpty(agent.Photo))
            {
                await _fileSaver.DeleteFile(agent.Photo, AgentFolderPath);
            }

            await _agentsRepository.Delete(id);
            await _outputCache.EvictByTagAsync(cacheTag, default);
        }
    }
}

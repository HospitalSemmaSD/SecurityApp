using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.Context;
using SecApp.Api.DTOs.CommunicationDTOs;
using SecApp.Api.Entities;
using System.Security.Claims;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IncidentsController : ControllerBase
    {
        private readonly SecurityDBContext _context;

        public IncidentsController(SecurityDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShiftIncidentDTO>>> GetRecentIncidents()
        {
            // Ampliamos el rango a las últimas 72 horas para asegurar visibilidad en pruebas iniciales
            var limitDate = DateTime.UtcNow.AddHours(-72);

            var incidents = await _context.ShiftIncidents
                .Include(i => i.Shift)
                .Include(i => i.DutyPost)
                .Where(i => i.CreatedAt >= limitDate)
                .OrderByDescending(i => i.CreatedAt)
                .Select(i => new ShiftIncidentDTO
                {
                    Id = i.Id,
                    Title = i.Title,
                    Description = i.Description,
                    Severity = i.Severity,
                    ShiftName = i.Shift != null ? i.Shift.Name : "N/A",
                    DutyPostName = i.DutyPost != null ? i.DutyPost.Name : "N/A",
                    ReportedByUserName = "Oficial de Turno", 
                    CreatedAt = i.CreatedAt
                })
                .ToListAsync();

            return Ok(incidents);
        }

        [HttpPost]
        public async Task<ActionResult<ShiftIncidentDTO>> CreateIncident(ShiftIncidentCreateDTO incidentDTO)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System";

            var incident = new ShiftIncident
            {
                Title = incidentDTO.Title,
                Description = incidentDTO.Description,
                Severity = incidentDTO.Severity,
                ShiftId = incidentDTO.ShiftId,
                DutyPostId = incidentDTO.DutyPostId,
                ReportedByUserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.ShiftIncidents.Add(incident);
            await _context.SaveChangesAsync();

            // Retornamos el objeto completo para confirmación
            return Ok(new ShiftIncidentDTO 
            { 
                Id = incident.Id, 
                Title = incident.Title,
                CreatedAt = incident.CreatedAt 
            });
        }
    }
}

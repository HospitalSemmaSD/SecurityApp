using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.Context;
using SecApp.Api.DTOs.DutyRosterDTOs;
using SecApp.Api.Entities;
using System.Security.Claims;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TemplatesController : ControllerBase
    {
        private readonly SecurityDBContext _context;

        public TemplatesController(SecurityDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RosterTemplateDTO>>> GetTemplates()
        {
            return await _context.RosterTemplates
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => new RosterTemplateDTO
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    CreatedAt = t.CreatedAt
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<string>> GetTemplateData(int id)
        {
            var template = await _context.RosterTemplates.FindAsync(id);
            if (template == null) return NotFound();
            return Ok(new { JsonData = template.JsonData });
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Operator")]
        public async Task<ActionResult<RosterTemplateDTO>> CreateTemplate(RosterTemplateCreateDTO dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System";

            var template = new RosterTemplate
            {
                Name = dto.Name,
                Description = dto.Description,
                JsonData = dto.JsonData,
                CreatedByUserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.RosterTemplates.Add(template);
            await _context.SaveChangesAsync();

            return Ok(new RosterTemplateDTO
            {
                Id = template.Id,
                Name = template.Name,
                CreatedAt = template.CreatedAt
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Operator")]
        public async Task<IActionResult> DeleteTemplate(int id)
        {
            var template = await _context.RosterTemplates.FindAsync(id);
            if (template == null) return NotFound();

            _context.RosterTemplates.Remove(template);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

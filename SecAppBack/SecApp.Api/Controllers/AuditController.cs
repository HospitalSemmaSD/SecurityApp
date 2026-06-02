using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.Context;
using SecApp.Api.DTOs.CommonDTOs;
using SecApp.Api.DTOs.UserDTOs;
using SecApp.Api.Utilities;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Solo administradores pueden ver la auditoría
    public class AuditController : ControllerBase
    {
        private readonly SecurityDBContext _context;

        public AuditController(SecurityDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditLogDTO>>> GetLogs([FromQuery] PaginationDTO pagination)
        {
            var queryable = _context.AuditLogs.AsQueryable();

            // Usando el nombre real del método de extensión encontrado en HttpContextExtensions.cs
            await HttpContext.InsertParamsHeader(queryable);

            var logs = await queryable
                .OrderByDescending(x => x.Timestamp)
                .Pager(pagination) // Usando el nombre real del método de extensión 'Pager'
                .Select(x => new AuditLogDTO
                {
                    Id = x.Id,
                    UserName = x.UserName,
                    Action = x.Action,
                    EntityType = x.EntityType,
                    EntityId = x.EntityId,
                    Details = x.Details,
                    Timestamp = x.Timestamp
                })
                .ToListAsync();

            return Ok(logs);
        }
    }
}

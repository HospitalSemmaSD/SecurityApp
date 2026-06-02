using SecApp.Api.Context;
using SecApp.Api.Entities;
using SecApp.Api.Services.Interfaces;
using System.Security.Claims;

namespace SecApp.Api.Services
{
    public class AuditService : IAuditService
    {
        private readonly SecurityDBContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuditService(SecurityDBContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task LogActionAsync(string action, string entityType, string? entityId = null, string? details = null)
        {
            var user = _httpContextAccessor.HttpContext?.User;
            var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System";
            var userName = user?.FindFirst("fullName")?.Value ?? user?.Identity?.Name ?? "System";

            var log = new AuditLog
            {
                UserId = userId,
                UserName = userName,
                Action = action,
                EntityType = entityType,
                EntityId = entityId,
                Details = details,
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}

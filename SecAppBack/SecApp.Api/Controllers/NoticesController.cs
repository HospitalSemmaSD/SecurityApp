using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.Context;
using SecApp.Api.DTOs.CommunicationDTOs;
using SecApp.Api.Entities;
using SecApp.Api.Hubs;
using System.Security.Claims;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoticesController : ControllerBase
    {
        private readonly SecurityDBContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public NoticesController(SecurityDBContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpGet("active")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<InternalNoticeDTO>>> GetActiveNotices()
        {
            var today = DateTime.UtcNow.Date;

            var notices = await _context.InternalNotices
                .Where(n => n.IsActive && (n.ExpirationDate == null || n.ExpirationDate.Value.Date >= today))
                .OrderByDescending(n => n.IsUrgent)
                .ThenByDescending(n => n.CreatedAt)
                .Select(n => new InternalNoticeDTO
                {
                    Id = n.Id,
                    Title = n.Title,
                    Content = n.Content,
                    IsUrgent = n.IsUrgent,
                    AuthorUserName = "Administración",
                    CreatedAt = n.CreatedAt
                })
                .ToListAsync();

            return Ok(notices);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Operator")]
        public async Task<ActionResult<InternalNoticeDTO>> CreateNotice(InternalNoticeCreateDTO noticeDTO)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System";

            var notice = new InternalNotice
            {
                Title = noticeDTO.Title,
                Content = noticeDTO.Content,
                IsUrgent = noticeDTO.IsUrgent,
                ExpirationDate = noticeDTO.ExpirationDate,
                AuthorUserId = userId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.InternalNotices.Add(notice);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("ReceiveNotice", new { 
                Title = notice.Title, 
                Content = notice.Content,
                IsUrgent = notice.IsUrgent 
            });

            return Ok(new InternalNoticeDTO { Id = notice.Id, Title = notice.Title });
        }
    }
}

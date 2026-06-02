using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.Entities
{
    public class AuditLog
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string Action { get; set; } = string.Empty; // e.g., "Create", "Delete", "Close"

        [Required]
        public string EntityType { get; set; } = string.Empty; // e.g., "DutyAssignment", "WeeklyRoster"

        public string? EntityId { get; set; }

        public string? Details { get; set; } // JSON or descriptive string

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}

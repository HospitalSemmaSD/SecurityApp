using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SecApp.Api.Entities
{
    public class ShiftIncident
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Severity { get; set; } = "Low"; // Low, Medium, High

        public int? ShiftId { get; set; }
        [ForeignKey("ShiftId")]
        public Shift? Shift { get; set; }

        public int? DutyPostId { get; set; }
        [ForeignKey("DutyPostId")]
        public DutyPost? DutyPost { get; set; }

        [Required]
        public string ReportedByUserId { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.Entities
{
    public class RosterTemplate
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public string JsonData { get; set; } = string.Empty; // Snapshot serializado de asignaciones base

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public string CreatedByUserId { get; set; } = string.Empty;
    }
}

using System.ComponentModel.DataAnnotations;

namespace SecApp.Api.Entities
{
    public class WeeklyRoster
    {
        public int Id { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; } // Siempre el lunes de la semana
        
        public bool IsClosed { get; set; }
        
        public DateTime? ClosedAt { get; set; }

        // Datos de firmas en el momento del cierre
        public string? PreparerName { get; set; }
        public string? PreparerRank { get; set; }
        public string? ApproverName { get; set; }
        public string? ApproverRank { get; set; }

        // Snapshot JSON de todas las asignaciones
        public string? SnapshotData { get; set; }
    }
}

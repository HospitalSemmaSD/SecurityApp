using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SecApp.Api.DTOs.DutyRosterDTOs
{
    public class ShiftDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string TimeRange => $"{StartTime:hh\\:mm} a {EndTime:hh\\:mm}";
    }

    public class ShiftCreateDTO
    {
        [Required]
        [StringLength(50)]
        public required string Name { get; set; }
        [Required]
        public TimeSpan StartTime { get; set; }
        [Required]
        public TimeSpan EndTime { get; set; }
    }

    public class DutyPostDTO
    {
        public int Id { get; set; }
        public required string Name { get; set; }
    }

    public class DutyPostCreateDTO
    {
        [Required]
        [StringLength(100)]
        public required string Name { get; set; }
    }

    public class DutyAssignmentDTO
    {
        public int Id { get; set; }
        public DateTime WeekStartDate { get; set; }
        public int AgentId { get; set; }
        public string AgentName { get; set; } = string.Empty;
        public string AgentRank { get; set; } = string.Empty;
        public string AgentInstitution { get; set; } = string.Empty;
        public string AgentPhone { get; set; } = string.Empty;

        public int ShiftId { get; set; }
        public string ShiftName { get; set; } = string.Empty;
        public string ShiftTimeRange { get; set; } = string.Empty;

        public int DutyPostId { get; set; }
        public string DutyPostName { get; set; } = string.Empty;
    }
    public class DutyAssignmentCreateDTO
    {
        [Required]
        public DateTime WeekStartDate { get; set; }
        [Required]
        public int AgentId { get; set; }
        [Required]
        public int ShiftId { get; set; }
        [Required]
        public int DutyPostId { get; set; }
    }

    public class WeeklyRosterDTO
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public bool IsClosed { get; set; }
        public DateTime? ClosedAt { get; set; }
        public string? PreparerName { get; set; }
        public string? PreparerRank { get; set; }
        public string? ApproverName { get; set; }
        public string? ApproverRank { get; set; }
        public string? SnapshotData { get; set; }
    }

    public class CloseRosterDTO
    {
        public DateTime Date { get; set; } // Representa el StartDate
    }

    public class CloneRosterDTO
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
}

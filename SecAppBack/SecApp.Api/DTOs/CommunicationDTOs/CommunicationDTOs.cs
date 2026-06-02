namespace SecApp.Api.DTOs.CommunicationDTOs
{
    public class ShiftIncidentDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = "Low";
        public string? ShiftName { get; set; }
        public string? DutyPostName { get; set; }
        public string ReportedByUserName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class ShiftIncidentCreateDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = "Low";
        public int? ShiftId { get; set; }
        public int? DutyPostId { get; set; }
    }

    public class InternalNoticeDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsUrgent { get; set; }
        public string AuthorUserName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class InternalNoticeCreateDTO
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public bool IsUrgent { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }
}

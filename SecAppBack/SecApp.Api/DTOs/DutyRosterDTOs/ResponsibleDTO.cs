namespace SecApp.Api.DTOs.DutyRosterDTOs
{
    public class ResponsibleDTO
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Rank { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class ResponsibleCreateDTO
    {
        public required string FullName { get; set; }
        public required string Rank { get; set; }
        public required string Position { get; set; }
    }
}

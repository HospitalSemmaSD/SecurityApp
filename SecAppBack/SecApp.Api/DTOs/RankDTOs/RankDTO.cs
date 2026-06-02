namespace SecApp.Api.DTOs.RankDTOs
{
    public class RankDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int InstitutionId { get; set; }

        public string InstitutionName { get; set; } = string.Empty;
    }

    public class RankCreateDTO
    {
        public required string Name { get; set; } = null!;
        public required int InstitutionId { get; set; }
    }
}
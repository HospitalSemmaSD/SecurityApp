namespace SecApp.Api.DTOs.CommonDTOs
{
    public class AuthResponseDTO
    {
        public required string Token { get; set; }
        public DateTime TokenExpiration { get; set; }
        public string? RefreshToken { get; set; }
    }
}

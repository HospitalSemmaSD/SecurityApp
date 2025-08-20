namespace SecApp.Api.DTOs
{
    public class AuthResponseDTO
    {
        public required string Token { get; set; }
        public DateTime TokenExpiration { get; set; }
    }
}

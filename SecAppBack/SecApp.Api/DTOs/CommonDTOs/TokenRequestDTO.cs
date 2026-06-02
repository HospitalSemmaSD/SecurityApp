namespace SecApp.Api.DTOs.CommonDTOs
{
    public class TokenRequestDTO
    {
        public required string Token { get; set; }
        public required string RefreshToken { get; set; }
    }
}

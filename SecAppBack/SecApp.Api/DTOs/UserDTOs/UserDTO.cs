namespace SecApp.Api.DTOs.UserDTOs
{
    // Para el AuthController (Login)
    public class UserCredentialsDTO
    {

        public required string Username { get; set; }
        public required string Password { get; set; }
    }

    public class UserCreateDTO
    {
        public required string Username { get; set; } // Ej: "130054"
        public required string Password { get; set; }
        public required string FullName { get; set; }
        public required string Role { get; set; }
        public string? Identification { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class UserUpdateDTO
    {
        public required string FullName { get; set; }
        public string? Identification { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public required string Role { get; set; }
        public string? Password { get; set; }
    }

    public class UserResponseDTO
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Identification { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public IList<string> Roles { get; set; } = new List<string>();
    }
}
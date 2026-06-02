using Microsoft.AspNetCore.Identity;

namespace SecApp.Api.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string? FullName { get; set; }
        public string? Identification { get; set; }
    }
}

using Microsoft.AspNetCore.Identity;
using SecApp.Api.Interfaces;
using System.Security.Claims;

namespace SecApp.Api.Utilities
{
    public class UsersServices : IUsersServices
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UsersServices(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<string> GetUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
                throw new UnauthorizedAccessException("Usuario no autenticado");

            return await Task.FromResult(userIdClaim.Value);
        }
    }
}
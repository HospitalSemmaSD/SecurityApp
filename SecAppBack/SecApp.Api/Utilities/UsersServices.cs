using Microsoft.AspNetCore.Identity;
using SecApp.Api.Interfaces;

namespace SecApp.Api.Utilities
{
    public class UsersServices : IUsersServices
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly UserManager<IdentityUser> userManager;

        public UsersServices(IHttpContextAccessor httpContextAccessor, UserManager<IdentityUser> userManager)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.userManager = userManager;
        }

        public async Task<string> GetUserId()
        {
            var email = httpContextAccessor.HttpContext!.User.Claims.FirstOrDefault(x => x.Type == "email")!.Value;
            var user = await userManager.FindByIdAsync(email);
            return user!.Id;

        }
    }
}

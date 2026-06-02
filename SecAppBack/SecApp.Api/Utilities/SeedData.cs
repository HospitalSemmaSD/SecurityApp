using Microsoft.AspNetCore.Identity;
using SecApp.Api.Entities;
using SecApp.Api.Enums;

namespace SecApp.Api.Utilities
{
    public static class SeedData
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

            // 1. Crear Roles si no existen
            foreach (var roleName in Enum.GetNames(typeof(Roles)))
            {
                var exists = await roleManager.RoleExistsAsync(roleName);
                if (!exists)
                {
                    var result = await roleManager.CreateAsync(new IdentityRole(roleName));
                    if (result.Succeeded)
                    {
                        logger.LogInformation($"✅ ÉXITO: Rol '{roleName}' creado.");
                    }
                }
            }

            // 2. Crear Usuario Admin inicial si no hay usuarios
            if (!userManager.Users.Any())
            {
                var adminUser = new ApplicationUser
                {
                    UserName = "admin",
                    FullName = "Administrador Inicial",
                    Email = "admin@hdssd.com",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, Roles.Admin.ToString());
                    logger.LogInformation("✅ ÉXITO: Usuario 'admin' (Admin123!) creado.");
                }
                else
                {
                    logger.LogError($"❌ ERROR creando admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
        }
    }
}
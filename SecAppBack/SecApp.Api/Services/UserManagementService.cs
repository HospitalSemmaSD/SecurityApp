using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.DTOs.UserDTOs;
using SecApp.Api.Entities;
using SecApp.Api.Enums;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Services
{
    public class UserManagementService : IUserManagementService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAuditService _auditService;

        public UserManagementService(UserManager<ApplicationUser> userManager, IAuditService auditService)
        {
            _userManager = userManager;
            _auditService = auditService;
        }

        public async Task<List<UserResponseDTO>> GetUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var userResponseList = new List<UserResponseDTO>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                userResponseList.Add(new UserResponseDTO
                {
                    Id = user.Id,
                    UserName = user.UserName!,
                    FullName = user.FullName ?? string.Empty,
                    Identification = user.Identification,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Roles = roles.ToList()
                });
            }

            return userResponseList;
        }

        public async Task<UserResponseDTO> GetUserByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) throw new KeyNotFoundException("Usuario no encontrado.");

            var roles = await _userManager.GetRolesAsync(user);

            return new UserResponseDTO
            {
                Id = user.Id,
                UserName = user.UserName!,
                FullName = user.FullName ?? string.Empty,
                Identification = user.Identification,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Roles = roles.ToList()
            };
        }

        public async Task<List<string>> GetAvailableRolesAsync()
        {
            return await Task.FromResult(Enum.GetNames(typeof(Roles)).ToList());
        }

        public async Task CreateUserAsync(UserCreateDTO userDto)
        {
            if (!Enum.TryParse<Roles>(userDto.Role, true, out _))
            {
                throw new ArgumentException($"El rol '{userDto.Role}' no es válido.");
            }

            if (await _userManager.FindByNameAsync(userDto.Username) != null)
            {
                throw new InvalidOperationException("Ya existe un usuario con ese código de empleado.");
            }

            var newUser = new ApplicationUser
            {
                UserName = userDto.Username,
                FullName = userDto.FullName,
                Identification = userDto.Identification,
                Email = userDto.Email,
                PhoneNumber = userDto.PhoneNumber,
                EmailConfirmed = true, // Evitar bloqueos por falta de confirmación
                PhoneNumberConfirmed = true
            };

            var result = await _userManager.CreateAsync(newUser, userDto.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(newUser, userDto.Role);

                await _auditService.LogActionAsync(
                    "Crear Usuario",
                    "User",
                    newUser.Id,
                    $"Usuario: {newUser.UserName}, Nombre: {newUser.FullName}, Rol: {userDto.Role}"
                );
            }
            else
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Error al crear usuario: {errors}");
            }
        }

        public async Task UpdateUserAsync(string id, UserUpdateDTO userDto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) throw new KeyNotFoundException("Usuario no encontrado.");

            // 1. Actualizar datos básicos y asegurar estado activo
            user.FullName = userDto.FullName;
            user.Identification = userDto.Identification;
            user.Email = userDto.Email;
            user.PhoneNumber = userDto.PhoneNumber;
            user.EmailConfirmed = true; 
            user.PhoneNumberConfirmed = true;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Error al actualizar datos del usuario: {errors}");
            }

            // 2. Actualizar Contraseña (Si se proporciona)
            if (!string.IsNullOrWhiteSpace(userDto.Password))
            {
                // Limpiar posibles bloqueos acumulados
                await _userManager.SetLockoutEndDateAsync(user, null);
                await _userManager.ResetAccessFailedCountAsync(user);

                // Método directo de reseteo para asegurar que la clave antigua no interfiera
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var addPasswordResult = await _userManager.ResetPasswordAsync(user, token, userDto.Password);
                
                if (!addPasswordResult.Succeeded)
                {
                    var errors = string.Join(", ", addPasswordResult.Errors.Select(e => e.Description));
                    throw new Exception($"Datos actualizados, pero falló la nueva contraseña: {errors}");
                }
            }

            // 3. Actualizar Rol (Atomicamente)
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (!currentRoles.Contains(userDto.Role))
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
                await _userManager.AddToRoleAsync(user, userDto.Role);
            }
            
            // 4. Asegurar sincronización final del sello de seguridad
            await _userManager.UpdateSecurityStampAsync(user);

            await _auditService.LogActionAsync(
                "Actualizar Usuario",
                "User",
                user.Id,
                $"Usuario: {user.UserName}, Nombre: {user.FullName}, Rol: {userDto.Role}"
            );
        }

        public async Task AssignRoleAsync(string userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new KeyNotFoundException("Usuario no encontrado.");

            if (!Enum.TryParse<Roles>(role, true, out _))
                throw new ArgumentException("Rol inválido.");

            // POLÍTICA DE ROL ÚNICO: Removemos todos los roles actuales antes de asignar el nuevo
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }

            var result = await _userManager.AddToRoleAsync(user, role);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Error al asignar rol: {errors}");
            }

            await _auditService.LogActionAsync(
                "Asignar Rol",
                "User",
                userId,
                $"Asignado rol {role} al usuario: {user.UserName}"
            );
        }

        public async Task RemoveRoleAsync(string userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) throw new KeyNotFoundException("Usuario no encontrado.");

            var result = await _userManager.RemoveFromRoleAsync(user, role);
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new Exception($"Error al remover rol: {errors}");
            }

            await _auditService.LogActionAsync(
                "Remover Rol",
                "User",
                userId,
                $"Removido rol {role} del usuario: {user.UserName}"
            );
        }
    }
}

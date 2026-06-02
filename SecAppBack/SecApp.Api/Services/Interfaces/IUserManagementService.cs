using SecApp.Api.DTOs.UserDTOs;

namespace SecApp.Api.Services.Interfaces
{
    public interface IUserManagementService
    {
        Task<List<UserResponseDTO>> GetUsersAsync();
        Task<UserResponseDTO> GetUserByIdAsync(string id);
        Task<List<string>> GetAvailableRolesAsync();
        Task CreateUserAsync(UserCreateDTO userDto);
        Task UpdateUserAsync(string id, UserUpdateDTO userDto);
        Task AssignRoleAsync(string userId, string role);
        Task RemoveRoleAsync(string userId, string role);
    }
}

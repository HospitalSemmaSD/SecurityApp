using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecApp.Api.DTOs.UserDTOs;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin, Operator")]
    public class UserManagementController : ControllerBase
    {
        private readonly IUserManagementService _userService;

        public UserManagementController(IUserManagementService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserResponseDTO>>> GetUsers()
        {
            return await _userService.GetUsersAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDTO>> GetUserById(string id)
        {
            return await _userService.GetUserByIdAsync(id);
        }

        [HttpGet("roles")]
        public async Task<ActionResult<List<string>>> GetRoles()
        {
            return await _userService.GetAvailableRolesAsync();
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser(UserCreateDTO userDto)
        {
            await _userService.CreateUserAsync(userDto);
            return Ok(new { message = "Usuario creado exitosamente." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, UserUpdateDTO userDto)
        {
            await _userService.UpdateUserAsync(id, userDto);
            return Ok(new { message = "Usuario actualizado exitosamente." });
        }

        [HttpPost("{userId}/roles/{role}")]
        [Authorize(Policy = "isAdmin")]
        public async Task<IActionResult> AssignRole(string userId, string role)
        {
            await _userService.AssignRoleAsync(userId, role);
            return Ok(new { message = $"Rol {role} asignado exitosamente." });
        }

        [HttpDelete("{userId}/roles/{role}")]
        [Authorize(Policy = "isAdmin")]
        public async Task<IActionResult> RemoveRole(string userId, string role)
        {
            await _userService.RemoveRoleAsync(userId, role);
            return Ok(new { message = $"Rol {role} removido exitosamente." });
        }
    }
}

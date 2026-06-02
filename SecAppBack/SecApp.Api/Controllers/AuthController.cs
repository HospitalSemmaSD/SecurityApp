using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SecApp.Api.DTOs.CommonDTOs;
using SecApp.Api.DTOs.UserDTOs;
using SecApp.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using SecApp.Api.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SecApp.Api.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IAuditService _auditService;

        public AuthController(UserManager<ApplicationUser> userManager, 
            SignInManager<ApplicationUser> signInManager, 
            IConfiguration configuration,
            IAuditService auditService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _auditService = auditService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login(UserCredentialsDTO credentials)
        {
            var user = await _userManager.FindByNameAsync(credentials.Username);

            if (user == null) 
            {
                await _auditService.LogActionAsync(
                    "Intento de Inicio de Sesión Fallido",
                    "User",
                    null,
                    $"Nombre de usuario no encontrado: {credentials.Username}"
                );
                return Unauthorized("Usuario no encontrado.");
            }

            // 1. Verificar si la cuenta está bloqueada
            if (await _userManager.IsLockedOutAsync(user)) 
            {
                await _auditService.LogActionAsync(
                    "Intento de Inicio de Sesión Fallido",
                    "User",
                    user.Id,
                    $"Usuario: {user.UserName} está bloqueado temporalmente por intentos fallidos."
                );
                return Unauthorized("Cuenta bloqueada por demasiados intentos fallidos.");
            }

            // 2. Verificar contraseña directamente (Sin afectar contador de bloqueos para diagnóstico)
            var isPasswordValid = await _userManager.CheckPasswordAsync(user, credentials.Password);
            
            if (!isPasswordValid)
            {
                await _auditService.LogActionAsync(
                    "Intento de Inicio de Sesión Fallido",
                    "User",
                    user.Id,
                    $"Usuario: {user.UserName} ingresó una contraseña incorrecta."
                );
                return Unauthorized("Contraseña incorrecta.");
            }

            // 3. Verificar si puede iniciar sesión (confirmaciones de email, etc)
            var canSignIn = await _signInManager.CanSignInAsync(user);
            if (!canSignIn)
            {
                await _auditService.LogActionAsync(
                    "Intento de Inicio de Sesión Fallido",
                    "User",
                    user.Id,
                    $"Usuario: {user.UserName} no cumple requisitos para ingresar (CanSignIn = false)."
                );
                return Unauthorized("La cuenta no tiene permisos para iniciar sesión (verifique confirmación de correo).");
            }

            // 4. Intento oficial de inicio de sesión
            var result = await _signInManager.CheckPasswordSignInAsync(user, credentials.Password, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                await _auditService.LogActionAsync(
                    "Inicio de Sesión",
                    "User",
                    user.Id,
                    $"Usuario: {user.UserName} ha iniciado sesión con éxito."
                );
                return await GenerateJwtToken(user);
            }

            if (result.IsLockedOut) 
            {
                await _auditService.LogActionAsync(
                    "Intento de Inicio de Sesión Fallido",
                    "User",
                    user.Id,
                    $"Usuario: {user.UserName} ha sido bloqueado en el proceso de inicio de sesión."
                );
                return Unauthorized("Cuenta bloqueada.");
            }
            
            if (result.IsNotAllowed) return Unauthorized("Acceso no permitido actualmente.");

            return Unauthorized("Error de autenticación desconocido.");
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await _auditService.LogActionAsync(
                "Cerrar Sesión",
                "User",
                userId,
                "El usuario cerró su sesión activamente."
            );

            return Ok();
        }

        private async Task<AuthResponseDTO> GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName!),
                new Claim("fullname", user.FullName ?? string.Empty),
                new Claim("identification", user.Identification ?? string.Empty)
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["jwtkey"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiration = DateTime.UtcNow.AddHours(12);

            var securityToken = new JwtSecurityToken(issuer: null, audience: null, claims: claims, expires: expiration, signingCredentials: credentials);

            return new AuthResponseDTO
            {
                Token = new JwtSecurityTokenHandler().WriteToken(securityToken),
                TokenExpiration = expiration
            };
        }
    }
}

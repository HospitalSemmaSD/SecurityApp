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

            // 1. Verificar si la cuenta está bloqueada previamente
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

            // 2. Verificar si puede iniciar sesión (confirmaciones de email, etc)
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

            // 3. Intento oficial de inicio de sesión con incremento de fallos y bloqueo habilitado (lockoutOnFailure: true)
            var result = await _signInManager.CheckPasswordSignInAsync(user, credentials.Password, lockoutOnFailure: true);

            if (result.Succeeded)
            {
                // Resetear contador tras inicio exitoso
                await _userManager.ResetAccessFailedCountAsync(user);

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
                    $"Usuario: {user.UserName} ha sido bloqueado temporalmente por exceder el límite de intentos fallidos."
                );
                return Unauthorized("Cuenta bloqueada por exceder el límite de intentos fallidos.");
            }
            
            // Si falló pero no está bloqueado (contraseña incorrecta)
            await _auditService.LogActionAsync(
                "Intento de Inicio de Sesión Fallido",
                "User",
                user.Id,
                $"Usuario: {user.UserName} ingresó una contraseña incorrecta."
            );
            return Unauthorized("Contraseña incorrecta.");
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
            
            // Expiración corta del JWT (15 minutos)
            var expiration = DateTime.UtcNow.AddMinutes(15);

            var securityToken = new JwtSecurityToken(issuer: null, audience: null, claims: claims, expires: expiration, signingCredentials: credentials);
            var tokenStr = new JwtSecurityTokenHandler().WriteToken(securityToken);

            // Generar y registrar el Refresh Token en la DB
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7); // Expira en 7 días
            await _userManager.UpdateAsync(user);

            return new AuthResponseDTO
            {
                Token = tokenStr,
                TokenExpiration = expiration,
                RefreshToken = refreshToken
            };
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = System.Security.Cryptography.RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<AuthResponseDTO>> Refresh(TokenRequestDTO tokenRequest)
        {
            if (tokenRequest is null) return BadRequest("Solicitud inválida.");

            var principal = GetPrincipalFromExpiredToken(tokenRequest.Token);
            if (principal is null) return BadRequest("Token de acceso inválido.");

            var username = principal.Identity?.Name;
            if (string.IsNullOrEmpty(username)) return BadRequest("Nombre de usuario inválido.");

            var user = await _userManager.FindByNameAsync(username);
            if (user is null || user.RefreshToken != tokenRequest.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            {
                return BadRequest("Token de refresco inválido o expirado.");
            }

            var newTokens = await GenerateJwtToken(user);

            await _auditService.LogActionAsync(
                "Refrescar Token",
                "User",
                user.Id,
                $"Token de acceso renovado automáticamente para el usuario: {user.UserName}."
            );

            return Ok(newTokens);
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["jwtkey"]!)),
                ValidateLifetime = false // Ignorar validación de expiración aquí
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);
                if (securityToken is not JwtSecurityToken jwtSecurityToken || 
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return null;
                }
                return principal;
            }
            catch
            {
                return null;
            }
        }
    }
}

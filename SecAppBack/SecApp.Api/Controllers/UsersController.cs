using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SecApp.Api.DTOs;
using SecApp.Api.Utilities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SecApp.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly IConfiguration configuration;
        private readonly SecurityDBContext context;
        private readonly IMapper mapper;

        public UsersController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration, 
                                SecurityDBContext context, IMapper mapper)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.context= context;
            this.mapper = mapper;
        }

        [HttpGet("UsersList")]
        public async Task<ActionResult<List<UserDTO>>> UsersList([FromQuery] PaginationDTO paginationDTO)
        {
            var queryable = context.Users.AsQueryable();
            await HttpContext.InsertParamsHeader(queryable);
            var users = await queryable.ProjectTo<UserDTO>(mapper.ConfigurationProvider).OrderBy(x => x.Email).Pager(paginationDTO).ToListAsync();
            return Ok(users);

        }


        [HttpPost("signup")]
        public async Task<ActionResult<AuthResponseDTO>>  SignUp(UserCredentialsDTO userCredentialsDTO)
        {
            var user = new IdentityUser
            {
                Email = userCredentialsDTO.Email,
                UserName = userCredentialsDTO.Email
            };
            var result = await userManager.CreateAsync(user, userCredentialsDTO.Password);
            if (result.Succeeded) { return await Tokering(user); }
            else { return BadRequest(result.Errors); }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDTO>> Login(UserCredentialsDTO credentialsDTO)
        {
            var user = await userManager.FindByEmailAsync(credentialsDTO.Email);
            if (user == null) 
            {
                var errors = Loginerror();
                return BadRequest(errors);
            }
            var result = await signInManager.CheckPasswordSignInAsync(user, credentialsDTO.Password, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                return await Tokering(user);
            }
            else
            {
                var errors = Loginerror();
                return BadRequest(errors);
            }

        }
        private IEnumerable<IdentityError> Loginerror()
        {
            var identityError = new IdentityError() { Description = "Login Incorrecto" };
            var errors = new List<IdentityError>();
            errors.Add(identityError);
            return errors;
        }
        private async Task<AuthResponseDTO> Tokering( IdentityUser identityUser)
        {
            var claims = new List<Claim>
            {
                new Claim("email", identityUser.Email!),                
                new Claim("other", "other info that i want")
            };

            var dbClaims = await this.userManager.GetClaimsAsync(identityUser);
            claims.AddRange(dbClaims);
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["jwtkey"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expiration = DateTime.UtcNow.AddYears(1);
            var securityToken = new JwtSecurityToken(issuer: null, audience: null, claims: claims, expires: expiration, signingCredentials: credentials);
            var token = new JwtSecurityTokenHandler().WriteToken(securityToken);
            return new AuthResponseDTO { Token = token, TokenExpiration =  expiration };
        }

        [HttpPost("MakeAdmin")]
        public async Task<IActionResult> MakeAdmin(EditClaimDTO editClaimDTO) 
        {
            var user = await userManager.FindByEmailAsync(editClaimDTO.Email);
            if (user == null) { return NotFound(); }
            await userManager.AddClaimAsync(user, new Claim("isAdmin", "true"));
            return NoContent();
        }

        [HttpPost("RemoveAdmin")]
        public async Task<IActionResult> RemoveAdmin(EditClaimDTO editClaimDTO)
        {
            var user = await userManager.FindByEmailAsync(editClaimDTO.Email);
            if (user == null) { return NotFound(); }
            await userManager.RemoveClaimAsync(user, new Claim("isAdmin", "true"));
            return NoContent();
        }
    }
}

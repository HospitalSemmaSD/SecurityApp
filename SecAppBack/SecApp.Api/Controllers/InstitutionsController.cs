using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using SecApp.Api.DTOs.InstitutionDTOs;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,Operator")]
    public class InstitutionsController : ControllerBase
    {
        private readonly IInstitutionService _institutionService;
        private const string CacheKey = "institutions";

        public InstitutionsController(IInstitutionService institutionService)
        {
            _institutionService = institutionService;
        }

        [HttpGet]
        [OutputCache(Tags = [CacheKey])]
        public async Task<ActionResult<List<InstitutionDTO>>> Get()
        {
            return await _institutionService.GetInstitutions();
        }

        [HttpGet("{id:int}", Name = "GetInstitutionByID")]
        [OutputCache(Tags = [CacheKey])]
        public async Task<ActionResult<InstitutionDTO>> Get(int id)
        {
            var institution = await _institutionService.GetInstitutionById(id);
            if (institution is null) return NotFound();
            return institution;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] InstitutionCreateDTO institutionCreateDTO)
        {
            var institution = await _institutionService.CreateInstitution(institutionCreateDTO);
            return CreatedAtRoute("GetInstitutionByID", new { id = institution.Id }, institution);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] InstitutionDTO institutionDTO)
        {
            if (id != institutionDTO.Id) return BadRequest("El ID no coincide.");
            await _institutionService.UpdateInstitution(id, institutionDTO);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _institutionService.DeleteInstitution(id);
            return NoContent();
        }
    }
}

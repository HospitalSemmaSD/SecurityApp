using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using SecApp.Api.DTOs;
using SecApp.Api.Interfaces;
using SecApp.Api.Models;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isAdmin")]
    public class InstitutionsController : ControllerBase
    {
        private readonly ICRUDRepository<Institution> repository;
        private readonly IOutputCacheStore outputCache;
        private readonly IMapper mapper;
        private const string CacheKey = "institutions";

        public InstitutionsController(ICRUDRepository<Institution> repository, IOutputCacheStore outputCache, IMapper mapper)
        {
            this.repository = repository;
            this.outputCache = outputCache;
            this.mapper = mapper;
        }

        [HttpGet]
        [OutputCache(Tags = [CacheKey])]
        public async Task<IActionResult> Get()
        {
            var institutions = await repository.GetAll();
            if (institutions is null)
            {
                return NotFound();
            }
            var institutionsDTOs = mapper.Map<List<InstitutionDTO>>(institutions);
            return Ok(institutionsDTOs);
        }

        [HttpGet]
        [Route("{id:int}", Name = "GetInstitutionByID")]
        [OutputCache(Tags = [CacheKey])]
        public async Task<ActionResult<InstitutionDTO>> Get(int id)
        {
            var institution = await repository.GetDetails(id);
            if (institution is null)
            {
                return NotFound();
            }
            var institutionDTO = mapper.Map<InstitutionDTO>(institution);
            return Ok(institutionDTO);
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromForm] InstitutionCreateDTO institutionCreateDTO)
        {
            if (institutionCreateDTO is null)
            {
                return BadRequest("Informacion de la Institución requerida");
            }
            var institution = mapper.Map<Institution>(institutionCreateDTO);
            var result = await repository.Insert(institution);
            if (!result)
            {
                return BadRequest("Error creando la institucion.");
            }
            await outputCache.EvictByTagAsync(CacheKey, default);
            return CreatedAtRoute("GetInstitutionByID", new { id = institution.InstitutionId }, institutionCreateDTO);
        }

    }
}

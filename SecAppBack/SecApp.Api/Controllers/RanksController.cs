using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using SecApp.Api.DTOs.RankDTOs;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,Operator")]
    public class RanksController : ControllerBase
    {
        private readonly IRankService _rankService;
        private const string CacheKey = "ranks";

        public RanksController(IRankService rankService)
        {
            _rankService = rankService;
        }

        [HttpGet]
        [OutputCache(Tags = [CacheKey])]
        public async Task<ActionResult<List<RankDTO>>> Get()
        {
            return await _rankService.GetRanks();
        }

        [HttpGet("{id:int}", Name = "GetRankByID")]
        [OutputCache(Tags = [CacheKey])]
        public async Task<ActionResult<RankDTO>> Get(int id)
        {
            var rank = await _rankService.GetRankById(id);
            if (rank is null) return NotFound();
            return rank;
        }

        [HttpGet("institution/{institutionId:int}")]
        [OutputCache(Tags = [CacheKey])]
        public async Task<ActionResult<List<RankDTO>>> GetByInstitution(int institutionId)
        {
            return await _rankService.GetRanksByInstitution(institutionId);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RankCreateDTO dto)
        {
            var rank = await _rankService.CreateRank(dto);
            return CreatedAtRoute("GetRankByID", new { id = rank.Id }, rank);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] RankDTO dto)
        {
            if (id != dto.Id) return BadRequest("ID mismatch.");
            await _rankService.UpdateRank(id, dto);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _rankService.DeleteRank(id);
            return NoContent();
        }
    }
}

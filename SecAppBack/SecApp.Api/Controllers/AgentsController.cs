using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using SecApp.Api.DTOs.CommonDTOs;
using SecApp.Api.DTOs.AgentDTOs;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AgentsController : ControllerBase
    {
        private readonly IAgentService _agentService;
        private const string cacheTag = "agents";

        public AgentsController(IAgentService agentService)
        {
            _agentService = agentService;
        }

        [HttpGet]
        public async Task<ActionResult<List<AgentDTO>>> Get([FromQuery] PaginationDTO pagination, [FromQuery] bool? status)
        {
            return await _agentService.GetAgents(pagination, HttpContext, status);
        }

        [HttpGet("{id:int}", Name = "GetAgentByID")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<AgentDTO>> Get(int id)
        {
            var agent = await _agentService.GetAgentById(id);
            if (agent is null) return NotFound();

            return agent;
        }

        [HttpGet("code/{code}")]
        public async Task<ActionResult<AgentDTO>> GetByCode(string code)
        {
            var agent = await _agentService.GetAgentByCode(code);
            if (agent is null) return NotFound();

            return agent;
        }

        [HttpGet("ident/{identification}")]
        public async Task<ActionResult<AgentDTO>> GetByIdentification(string identification)
        {
            var agent = await _agentService.GetAgentByIdentification(identification);
            if (agent is null) return NotFound();

            return agent;
        }

        [HttpGet("search")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<List<AgentDTO>>> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query)) return BadRequest("El parámetro de búsqueda no puede estar vacío.");

            return await _agentService.SearchAgents(query);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Operator")]
        public async Task<IActionResult> CreateAgent([FromForm] AgentCreateDTO agentDTO)
        {
            var agent = await _agentService.CreateAgent(agentDTO);
            return CreatedAtRoute("GetAgentByID", new { id = agent.Id }, agent);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin,Operator")]
        public async Task<IActionResult> UpdateAgent(int id, [FromForm] AgentCreateDTO agentCreateDTO)
        {
            await _agentService.UpdateAgent(id, agentCreateDTO);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        [Authorize(Policy = "isAdmin")]
        public async Task<ActionResult> Delete(int id)
        {
            await _agentService.DeleteAgent(id);
            return NoContent();
        }
    }
}

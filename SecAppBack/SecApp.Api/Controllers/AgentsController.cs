using Microsoft.AspNetCore.Mvc;
using SecApp.Data.Interfaces;
using SecApp.Model;

namespace SecApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentsController : ControllerBase
    {
        private readonly ICRUDtRepository<Agent> agentsRepository;

        public AgentsController(ICRUDtRepository<Agent> agentsRepository)
        {
            this.agentsRepository = agentsRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await agentsRepository.GetAgents());
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] int id)
        {
            return Ok(await agentsRepository.GetDetails(id));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAgent([FromBody] Agent agent)
        {
            if (agent == null)
            {
                return BadRequest();

            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var created = await agentsRepository.InsertAgent(agent);
            return Created("Created", created);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateAgent([FromBody] Agent agent)
        {
            if (agent == null)
            {
                return BadRequest();

            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updated = await agentsRepository.UpdateAgent(agent);
            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            await agentsRepository.DeleteAgent(new Agent { AgentId = id });
            return NoContent();
        }
    }
}

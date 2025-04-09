using Microsoft.AspNetCore.Mvc;
using System.Configuration;
using MySql.Data.MySqlClient;
using Dapper;
using SecApp.Data.Interfaces;
using SecApp.Model;
using SecApp.Data;

namespace SecApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentsController : ControllerBase
    {
        private readonly ICRUDtRepository<Agent> agentsRepository;
         private readonly MySQLConfiguration connection;

        public AgentsController(MySQLConfiguration connection, ICRUDtRepository<Agent> agentsRepository)
        {
            this.connection = connection;
            this.agentsRepository = agentsRepository;
        }
    
         protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(connection.ConnectionString);
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

        [HttpGet("GetAgentsRanges")]   
        public async Task<IActionResult> GetAgentsRanges()
        {
            List<AgentVM> agents = new List<AgentVM>();
            var db = dbConnection();
            var sql = @"SELECT a.name as Name, a.lastname as LastName, a.phone as Phone, a.photo as Photo, r.name as RangeName 
                        FROM agents a 
                        join ranges r
                        on a.rangeId = r.rangeId";
            var result = await db.QueryAsync<AgentVM>(sql, new { });
            foreach (var item in result)
            {
                agents.Add(new AgentVM
                {
                    Name = item.Name,
                    LastName = item.LastName,
                    Phone = item.Phone,
                    RangeName = item.RangeName,                    
                    Photo = item.Photo
                });
            }
            return Ok(agents);
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

using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.OutputCaching;
using SecApp.Api.DTOs;
using SecApp.Api.Interfaces;
using SecApp.Api.Models;

namespace SecApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentsController : ControllerBase
    {
        private readonly ICRUDtRepository<Agent> agentsRepository;
        private readonly IOutputCacheStore outputCache;       

        public AgentsController( 
                                ICRUDtRepository<Agent> agentsRepository,
                                IOutputCacheStore outputCache)
        {
          
            this.agentsRepository = agentsRepository;
            this.outputCache = outputCache;
        }

        //protected MySqlConnection dbConnection()
        //{
        //    return new MySqlConnection(connection.ConnectionString);
        //}

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await agentsRepository.GetAgents());
        }

        [HttpGet("{id }", Name = "GetAgentByID")]
        [OutputCache(Tags = ["agents"])]
        public async Task<IActionResult> Get(int id)
        {
            return Ok(await agentsRepository.GetDetails(id));
        }

        [HttpGet("GetAgentsRanges")]
        [OutputCache(Tags = ["agents"])] //how to know that this item is in the cache?
        public async Task<IActionResult> GetAgentsRanges()
        {
            //List<AgentVM> agents = new List<AgentVM>();
            //var db = dbConnection();
            //var sql = @"SELECT a.name as Name, a.lastname as LastName, a.phone as Phone, a.photo as Photo,
            //            a.AgentCode, a.Identification, r.name as RangeName 
            //            FROM agents a 
            //            join ranges r
            //            on a.rangeId = r.rangeId";
            //var result = await db.QueryAsync<AgentVM>(sql, new { });
            //foreach (var item in result)
            //{
            //    agents.Add(new AgentVM
            //    {
            //        Name = item.Name,
            //        LastName = item.LastName,
            //        Phone = item.Phone,
            //        RangeName = item.RangeName,
            //        Photo = item.Photo,
            //        Identification = item.Identification,
            //        AgentCode = item.AgentCode
            //    });
            //}
            var agents = new List<Agent>();
            return Ok(agents);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAgent([FromBody] AgentCreateDTO agentDTO)
        {
            if (agentDTO == null)
            {
                return BadRequest();

            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var agent = new Agent
            {
                Name = agentDTO.Name,
                LastName = agentDTO.LastName,
                Phone = agentDTO.Phone,
                Identification = agentDTO.Identification,
                Email = agentDTO.Email,
                BirthDay = agentDTO.BirthDay,
                Status = agentDTO.Status,
                Photo = agentDTO.Photo,
                AgentCode = agentDTO.AgentCode,
                RangeId = agentDTO.RangeId,

            };
            var created = await agentsRepository.InsertAgent(agent);
            await outputCache.EvictByTagAsync("agents", default);
            return CreatedAtRoute("GetAgentByID", new {id = agent.AgentId }, agent);
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
            //await agentsRepository.DeleteAgent(new Agent { AgentId = id });
            return NoContent();
        }

        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No valid file");

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            // fileName most be the agent code
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
            return Ok(new { imageUrl });

            // var urlPath = $"/uploads/agents/{fileName}";
            // //return Ok(new { filePath = urlPath });
            // return Ok(new { fileName, urlPath });
        }

    }


}

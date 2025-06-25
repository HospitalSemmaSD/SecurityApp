using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using SecApp.Api;
using SecApp.Api.DTOs;
using SecApp.Api.Interfaces;
using SecApp.Api.Models;
using SecApp.Api.Utilities;
using System.Threading.Tasks;

namespace SecApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgentsController : ControllerBase
    {
        private readonly ICRUDRepository<Agent> agentsRepository;
        private readonly IOutputCacheStore outputCache;
        private readonly IMapper mapper;
        private readonly IFileSaver fileSaver;
        private readonly SecurityDBContext context;
        private const string cacheTag = "agents";
        private readonly string AgentFolderPath = "agents"; // "wwwroot/uploads/agents"; // Ensure this path exists in your project

        public AgentsController(
                                ICRUDRepository<Agent> agentsRepository,
                                IOutputCacheStore outputCache, IMapper mapper, IFileSaver fileSaver, SecurityDBContext context)
        {

            this.agentsRepository = agentsRepository;
            this.outputCache = outputCache;
            this.mapper = mapper;
            this.fileSaver = fileSaver;
            this.context = context;
        }


        [HttpGet]
        public async Task<List<AgentDTO>> Get([FromQuery] PaginationDTO pagination)
        {
            var queryable = await agentsRepository.GetAll();

            await HttpContext.InsertParamsHeader(queryable);
            queryable = queryable
                .OrderBy(a => a.Name)
                .Pager(pagination);

            var agentsDTOs = mapper.Map<List<AgentDTO>>(queryable);

            return agentsDTOs;
        }

        [HttpGet("{id:int}", Name = "GetAgentByID")]
        [OutputCache(Tags = [cacheTag])]
        public async Task<ActionResult<AgentDTO>> Get(int id)
        {
            var agent = await agentsRepository.GetDetails(id);
            if (agent is null)
            {
                return NotFound();
            }
            var agentDTO = mapper.Map<AgentDTO>(agent);

            return agentDTO;
        }

        [HttpGet("GetAgentsRanges")]
        [OutputCache(Tags = [cacheTag])] //how to know that this item is in the cache?
        public async Task<IActionResult> GetAgentsRanges()
        {

            var agents = new List<Agent>();
            return Ok(agents);
        }

        [HttpGet("{name}")]
        [OutputCache(Tags = [cacheTag])]
        public async Task <ActionResult<List<AgentDTO>>> Get(string name)
        {
                                
            return await context.Agents.Where(a => a.Name.Contains(name) || a.LastName.Contains(name))
                .ProjectTo<AgentDTO>(mapper.ConfigurationProvider)
                .ToListAsync(); 
            
        }
        [HttpPost]
        public async Task<IActionResult> CreateAgent([FromForm] AgentCreateDTO agentDTO)
        {
            
            var agent = mapper.Map<Agent>(agentDTO);
            if (agentDTO.Photo != null)
            {

                var url = await fileSaver.SaveFile(AgentFolderPath, agentDTO.Photo);
                agent.Photo = url;
            }
          
            await agentsRepository.Insert(agent);
            await outputCache.EvictByTagAsync(cacheTag, default);
            return CreatedAtRoute("GetAgentByID", new { id = agent.AgentId }, agent);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAgent(int id, [FromForm] AgentCreateDTO agentCreateDTO)
        {
            var agent = await agentsRepository.GetDetails(id);
            
            if (agent == null)
            {
                return NotFound();
            }
            var updatedAgent = mapper.Map(agentCreateDTO, agent);
            updatedAgent.AgentId = id; // Ensure the ID is set correctly
            if (agent.Photo is not null)
            {
                agent.Photo = await fileSaver.Update(updatedAgent.Photo, AgentFolderPath, agentCreateDTO.Photo);
            }
            await agentsRepository.Update(updatedAgent);
            await outputCache.EvictByTagAsync(cacheTag, default);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var agentsDeleted = await agentsRepository.Delete(id);
            if (!agentsDeleted)
            {
                return NotFound();
            }
            await outputCache.EvictByTagAsync(cacheTag, default);
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

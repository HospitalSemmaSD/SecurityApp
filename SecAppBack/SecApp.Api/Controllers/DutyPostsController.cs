using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OutputCaching;
using SecApp.Api.DTOs.DutyRosterDTOs;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,Operator")]
    public class DutyPostsController : ControllerBase
    {
        private readonly IDutyPostService _service;
        private const string CacheKey = "dutyposts";

        public DutyPostsController(IDutyPostService service)
        {
            _service = service;
        }

        [HttpGet]
        [OutputCache(Tags = [CacheKey])]
        public async Task<ActionResult<List<DutyPostDTO>>> Get()
        {
            return await _service.GetDutyPosts();
        }

        [HttpGet("{id:int}", Name = "GetDutyPostByID")]
        [OutputCache(Tags = [CacheKey])]
        public async Task<ActionResult<DutyPostDTO>> Get(int id)
        {
            var post = await _service.GetDutyPostById(id);
            if (post is null) return NotFound();
            return post;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] DutyPostCreateDTO postDTO)
        {
            var post = await _service.CreateDutyPost(postDTO);
            return CreatedAtRoute("GetDutyPostByID", new { id = post.Id }, post);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] DutyPostCreateDTO postDTO)
        {
            await _service.UpdateDutyPost(id, postDTO);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteDutyPost(id);
            return NoContent();
        }
    }
}

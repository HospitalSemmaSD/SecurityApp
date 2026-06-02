using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecApp.Api.DTOs.DutyRosterDTOs;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,Operator")]
    public class ResponsiblesController : ControllerBase
    {
        private readonly IResponsibleService _service;

        public ResponsiblesController(IResponsibleService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<List<ResponsibleDTO>>> Get()
        {
            return await _service.GetResponsibles();
        }

        [HttpGet("active")]
        public async Task<ActionResult<List<ResponsibleDTO>>> GetActive()
        {
            return await _service.GetActiveResponsibles();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ResponsibleCreateDTO dto)
        {
            var result = await _service.CreateResponsible(dto);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] ResponsibleCreateDTO dto)
        {
            await _service.UpdateResponsible(id, dto);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteResponsible(id);
            return NoContent();
        }
    }
}

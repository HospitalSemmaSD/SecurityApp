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
    public class ShiftsController : ControllerBase
    {
        private readonly IShiftService _service;
        private const string CacheKey = "shifts";

        public ShiftsController(IShiftService service)
        {
            _service = service;
        }

        [HttpGet]
        [OutputCache(Tags = [CacheKey])]
        public async Task<ActionResult<List<ShiftDTO>>> Get()
        {
            return await _service.GetShifts();
        }

        [HttpGet("{id:int}", Name = "GetShiftByID")]
        [OutputCache(Tags = [CacheKey])]
        public async Task<ActionResult<ShiftDTO>> Get(int id)
        {
            var shift = await _service.GetShiftById(id);
            if (shift is null) return NotFound();
            return shift;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] ShiftCreateDTO shiftCreateDTO)
        {
            var shift = await _service.CreateShift(shiftCreateDTO);
            return CreatedAtRoute("GetShiftByID", new { id = shift.Id }, shift);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] ShiftCreateDTO shiftDTO)
        {
            await _service.UpdateShift(id, shiftDTO);
            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteShift(id);
            return NoContent();
        }
    }
}

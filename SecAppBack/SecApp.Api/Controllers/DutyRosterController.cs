using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecApp.Api.DTOs.DutyRosterDTOs;
using SecApp.Api.Services.Interfaces;
using System.Globalization;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin,Operator")]
    public class DutyRosterController : ControllerBase
    {
        private readonly IDutyRosterService _service;

        public DutyRosterController(IDutyRosterService service)
        {
            _service = service;
        }

        [HttpGet("daily")]
        public async Task<IActionResult> GetByDate([FromQuery] string date)
        {
            if (string.IsNullOrEmpty(date)) return BadRequest("Fecha requerida.");
            
            // Intentar parsear en formato ISO YYYY-MM-DD
            if (!DateTime.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate))
            {
                // Intento fallback por si viene en otro formato
                if (!DateTime.TryParse(date, out parsedDate))
                    return BadRequest("Formato de fecha inválido.");
            }

            var result = await _service.GetRosterByWeek(parsedDate);
            return Ok(result);
        }

        [HttpGet("status")]
        public async Task<IActionResult> GetStatusByDate([FromQuery] string date)
        {
            if (string.IsNullOrEmpty(date)) return BadRequest("Fecha requerida.");

            if (!DateTime.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate))
            {
                if (!DateTime.TryParse(date, out parsedDate))
                    return BadRequest("Formato de fecha inválido.");
            }

            var status = await _service.GetRosterStatus(parsedDate);
            return Ok(status);
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentDates()
        {
            try 
            {
                var dates = await _service.GetRecentRostersDates();
                var result = dates.Select(d => d.ToString("yyyy-MM-dd")).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al obtener fechas recientes", detail = ex.Message });
            }
        }

        [HttpPost("close")]
        public async Task<IActionResult> CloseRoster([FromBody] CloseRosterDTO dto)
        {
            var result = await _service.CloseRoster(dto.Date);
            return Ok(result);
        }

        [HttpPost("reopen")]
        public async Task<IActionResult> ReopenRoster([FromBody] CloseRosterDTO dto)
        {
            await _service.ReopenRoster(dto.Date);
            return Ok(new { message = "Guardia reabierta correctamente." });
        }

        [HttpPost("clone")]
        public async Task<IActionResult> CloneRoster([FromBody] CloneRosterDTO dto)
        {
            await _service.CloneRoster(dto.FromDate, dto.ToDate);
            return Ok(new { message = "Clonada correctamente." });
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearRoster([FromQuery] string date)
        {
            if (string.IsNullOrEmpty(date)) return BadRequest("Fecha requerida.");

            if (!DateTime.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate))
            {
                if (!DateTime.TryParse(date, out parsedDate))
                    return BadRequest("Formato de fecha inválido.");
            }

            await _service.ClearRoster(parsedDate);
            return Ok(new { message = "Guardia vaciada correctamente." });
        }

        [HttpPost]
        public async Task<IActionResult> CreateAssignment([FromBody] DutyAssignmentCreateDTO assignmentDTO)
        {
            var assignment = await _service.AssignAgent(assignmentDTO);
            return Ok(assignment);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            await _service.RemoveAssignment(id);
            return NoContent();
        }
    }
}

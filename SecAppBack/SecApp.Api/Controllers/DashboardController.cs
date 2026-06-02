using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Requiere estar autenticado para ver el dashboard
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("coverage")]
        public async Task<IActionResult> GetCoverage()
        {
            return Ok(await _dashboardService.GetCoverageStatsAsync());
        }

        [HttpGet("ranks")]
        public async Task<IActionResult> GetRanks()
        {
            return Ok(await _dashboardService.GetRankDistributionAsync());
        }

        [HttpGet("trend")]
        public async Task<IActionResult> GetTrend()
        {
            return Ok(await _dashboardService.GetWeeklyTrendAsync());
        }
    }
}

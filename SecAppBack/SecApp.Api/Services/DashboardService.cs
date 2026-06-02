using Microsoft.EntityFrameworkCore;
using SecApp.Api.Context;
using SecApp.Api.DTOs.DashboardDTOs;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly SecurityDBContext _context;

        public DashboardService(SecurityDBContext context)
        {
            _context = context;
        }

        public async Task<CoverageStatsDTO> GetCoverageStatsAsync()
        {
            var totalPosts = await _context.DutyPosts.CountAsync();
            var totalAgents = await _context.Agents.CountAsync();
            
            // Un puesto está cubierto si tiene una asignación en la semana actual
            var today = DateTime.Today;
            var daysUntilMonday = ((int)today.DayOfWeek - (int)DayOfWeek.Monday + 7) % 7;
            var currentWeekStart = today.AddDays(-daysUntilMonday).Date;

            var coveredPosts = await _context.DutyAssignments
                .Where(a => a.WeekStartDate == currentWeekStart)
                .Select(a => a.DutyPostId)
                .Distinct()
                .CountAsync();

            var activeAgents = await _context.DutyAssignments
                .Where(a => a.WeekStartDate == currentWeekStart)
                .Select(a => a.AgentId)
                .Distinct()
                .CountAsync();

            return new CoverageStatsDTO
            {
                TotalPosts = totalPosts,
                CoveredPosts = coveredPosts,
                TotalAgents = totalAgents,
                ActiveAgents = activeAgents
            };
        }

        public async Task<IEnumerable<RankCountDTO>> GetRankDistributionAsync()
        {
            return await _context.Agents
                .Include(a => a.Rank)
                .GroupBy(a => a.Rank != null ? a.Rank.Name : "Sin Rango")
                .Select(g => new RankCountDTO
                {
                    RankName = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<WeeklyTrendDTO>> GetWeeklyTrendAsync()
        {
            // Retorna las asignaciones diarias de los últimos 7 días
            var startDate = DateTime.Today.AddDays(-6);
            
            return await _context.DutyAssignments
                .Where(a => a.WeekStartDate >= startDate.AddDays(-7)) // Asegura traer data relevante
                .GroupBy(a => a.WeekStartDate) // En tu modelo actual, la data está por WeekStartDate
                .Select(g => new WeeklyTrendDTO
                {
                    Date = g.Key,
                    AssignmentCount = g.Count()
                })
                .OrderBy(t => t.Date)
                .ToListAsync();
        }
    }
}

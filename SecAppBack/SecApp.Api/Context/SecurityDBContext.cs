using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.Entities;
using Rank = SecApp.Api.Entities.Rank;


namespace SecApp.Api.Context
{
    public class SecurityDBContext : IdentityDbContext<ApplicationUser>
    {
        public SecurityDBContext(DbContextOptions options) : base(options)
        {
        }
 
        public DbSet<Agent> Agents { get; set; }
        public DbSet<Institution> Institutions { get; set; }
        public DbSet<Rank> Ranks  { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<DutyPost> DutyPosts { get; set; }
        public DbSet<DutyAssignment> DutyAssignments { get; set; }
        public DbSet<DepartmentResponsible> DepartmentResponsibles { get; set; }
        public DbSet<WeeklyRoster> WeeklyRosters { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<ShiftIncident> ShiftIncidents { get; set; }
        public DbSet<InternalNotice> InternalNotices { get; set; }
        public DbSet<RosterTemplate> RosterTemplates { get; set; }
    }
}

using Microsoft.EntityFrameworkCore;
using SecApp.Api.Models;
using Range = SecApp.Api.Models.Range;


namespace SecApp.Api
{
    public class SecurityDBContext : DbContext
    {
        public SecurityDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Agent> Agents { get; set; }
        public DbSet<Institution> Institutions { get; set; }
        public DbSet<Range> Ranges  { get; set; }
    }
}

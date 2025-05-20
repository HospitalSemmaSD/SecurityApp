using Microsoft.EntityFrameworkCore;
using SecApp.Api.Models;


namespace SecApp.Api
{
    public class SecurityDBContext : DbContext
    {
        public SecurityDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Agent> agents { get; set; }
    }
}

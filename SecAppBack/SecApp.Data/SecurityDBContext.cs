using Microsoft.EntityFrameworkCore;
using SecApp.Model;

namespace SecApp.Data
{
    public class SecurityDBContext : DbContext
    {
        public SecurityDBContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Agent> agents { get; set; }
    }
}

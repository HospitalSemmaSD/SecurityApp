using Microsoft.EntityFrameworkCore;
using SecApp.Api.Context;
using SecApp.Api.Entities;
using System.Linq.Expressions;

namespace SecApp.Api.Repositories
{
    public class AgentRepository : BaseRepository<Agent>
    {
        public AgentRepository(SecurityDBContext context) : base(context)
        {
        }

        public override IQueryable<Agent> GetAll()
        {
            return _dbSet
                .Include(a => a.Rank)
                    .ThenInclude(r => r!.Institution)
                .AsQueryable().OrderBy(a => a.LastName).ThenBy(a => a.LastName);
        }

        public override async Task<Agent?> GetById(int id)
        {
            return await _dbSet
                .Include(a => a.Rank)
                    .ThenInclude(r => r!.Institution)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public override async Task<IEnumerable<Agent>> Search(Expression<Func<Agent, bool>> predicate)
        {
            return await _dbSet
                .Include(a => a.Rank)
                    .ThenInclude(r => r!.Institution)
                .Where(predicate)
                .ToListAsync();
        }

        public override async Task<bool> Delete(int id)
        {
            var rowsDeleted = await _dbSet
                .Where(x => x.Id == id)
                .ExecuteDeleteAsync();

            return rowsDeleted > 0;
        }
    }
}

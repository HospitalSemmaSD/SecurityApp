using Microsoft.EntityFrameworkCore;
using SecApp.Api.Context;
using SecApp.Api.Entities;
using System.Linq.Expressions;

namespace SecApp.Api.Repositories
{
    public class RankRepository : BaseRepository<Rank>
    {
        public RankRepository(SecurityDBContext context) : base(context)
        {
        }

        public override IQueryable<Rank> GetAll()
        {
            return _dbSet
                .Include(r => r.Institution)
                .AsQueryable();
        }

        public override async Task<Rank?> GetById(int id)
        {
            return await _dbSet
                .Include(r => r.Institution)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public override async Task<IEnumerable<Rank>> Search(Expression<Func<Rank, bool>> predicate)
        {
            return await _dbSet
                .Include(r => r.Institution)
                .Where(predicate)
                .ToListAsync();
        }
    }
}

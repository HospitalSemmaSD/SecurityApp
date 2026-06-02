using Microsoft.EntityFrameworkCore;
using SecApp.Api.Context;
using SecApp.Api.Entities;
using System.Linq.Expressions;

namespace SecApp.Api.Repositories
{
    public class InstitutionRepository : BaseRepository<Institution>
    {
        public InstitutionRepository(SecurityDBContext context) : base(context)
        {
        }

        public override async Task<Institution?> GetById(int id)
        {
            return await _dbSet
                .Include(i => i.Ranks)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public override async Task<IEnumerable<Institution>> Search(Expression<Func<Institution, bool>> predicate)
        {
            return await _dbSet
                .Include(i => i.Ranks)
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

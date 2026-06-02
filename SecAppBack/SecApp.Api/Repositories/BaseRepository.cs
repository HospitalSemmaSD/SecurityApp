using Microsoft.EntityFrameworkCore;
using SecApp.Api.Context;
using SecApp.Api.Interfaces;
using System.Linq.Expressions;

namespace SecApp.Api.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected readonly SecurityDBContext _context;
        protected readonly DbSet<T> _dbSet;

        public BaseRepository(SecurityDBContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual IQueryable<T> GetAll()
        {
            return _dbSet.AsQueryable();
        }

        public virtual async Task<T?> GetById(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> Search(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }

        public virtual async Task<bool> Insert(T obj)
        {
            _dbSet.Add(obj);
            return await _context.SaveChangesAsync() > 0;
        }

        public virtual async Task<bool> Update(T obj)
        {
            _dbSet.Update(obj);
            return await _context.SaveChangesAsync() > 0;
        }

        public virtual async Task<bool> Delete(int id)
        {
            var entity = await GetById(id);
            if (entity == null) return false;

            _dbSet.Remove(entity);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}

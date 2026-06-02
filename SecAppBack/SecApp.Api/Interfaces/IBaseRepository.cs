using System.Linq.Expressions;

namespace SecApp.Api.Interfaces
{
    public interface IBaseRepository<T> where T : class
    {
        IQueryable<T> GetAll();
        Task<T?> GetById(int id);
        Task<IEnumerable<T>> Search(Expression<Func<T, bool>> predicate);
        Task<bool> Insert(T obj);
        Task<bool> Update(T obj);
        Task<bool> Delete(int id);

    }
}

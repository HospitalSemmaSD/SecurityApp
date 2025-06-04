namespace SecApp.Api.Interfaces
{
    public interface ICRUDRepository<T> where T : class
    {
        Task<List<T>> GetAll();

        Task<T> GetDetails(int id);
        Task<bool> Insert(T obj);
        Task<bool> Update(T obj);
        Task<bool> Delete(int id);

    }
}

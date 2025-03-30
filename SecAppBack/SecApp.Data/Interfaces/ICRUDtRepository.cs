namespace SecApp.Data.Interfaces
{
    public interface ICRUDtRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAgents();

        Task<T> GetDetails(int id);
        Task<bool> InsertAgent(T obj);
        Task<bool> UpdateAgent(T obj);
        Task<bool> DeleteAgent(T agent);

    }
}

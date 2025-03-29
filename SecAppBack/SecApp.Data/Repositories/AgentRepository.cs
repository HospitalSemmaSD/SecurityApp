using Dapper;
using MySql.Data.MySqlClient;
using SecApp.Data.Interfaces;
using SecApp.Model;

namespace SecApp.Data.Repositories
{
    public class AgentRepository : ICRUDtRepository<Agent>
    {
        private readonly MySQLConfiguration connection;

        public AgentRepository(MySQLConfiguration connection)
        {
            this.connection = connection;
        }
        protected MySqlConnection dbConnection() 
        {
            return new MySqlConnection(connection.ConnectionString);
        }

        public Task<IEnumerable<Agent>> GetAgents()
        {
            var db = dbConnection();
            var sql = @"SELECT * FROM AGENTS";
            return db.QueryAsync<Agent>(sql, new { });
        }

        public async Task<Agent> GetDetails(int id)
        {
            var db = dbConnection();
            var sql = @"SELECT * FROM agents WHERE agentId =@id";
            return await db.QueryFirstOrDefaultAsync<Agent>(sql, new { id = id });
        }

        public async Task<bool> InsertAgent(Agent agent)
        {
            var db = dbConnection();
            var sql = @"INSERT INTO agents(name, lastname, phone, identification, birthday, status, rangeid)
                        VALUES(@name, @lastname, @phone, @identification, @birthday, @status, @rangeid)";
            var result = await db.ExecuteAsync(sql, new { agent.Name, agent.LastName, agent.Phone, agent.Identification, agent.BirthDay, agent.Status, agent.RangeId});
            return result > 0; 
        }

        public async Task<bool> UpdateAgent(Agent agent)
        {
            var db = dbConnection();
            var sql = @"UPDATE agents
                        SET name = @Name, 
                            lastname = @lastName,
                            phone = @Phone,
                            identification = @Identification,
                            birthday = @Birthday, 
                            status = @Status,
                            rangeid = @RangeId
                            WHERE agentId = @AgentId";
            var result = await db.ExecuteAsync(sql, new
            {
                agent.Name,
                agent.LastName,
                agent.Phone,
                agent.Identification,
                agent.BirthDay,
                agent.Status,
                agent.RangeId,
                agent.AgentId
            });
            return result > 0;
        }
        public async Task<bool> DeleteAgent(Agent agent)
        {

            var db = dbConnection();
            var sql = @"DELETE FROM Agents WHERE agentId = @Id";
            var result = await db.ExecuteAsync(sql, new {Id = agent.AgentId });
            return result > 0;
        }
    }
}

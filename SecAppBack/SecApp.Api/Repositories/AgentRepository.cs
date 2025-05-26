


using Microsoft.EntityFrameworkCore;
using SecApp.Api.Interfaces;
using SecApp.Api.Models;

namespace SecApp.Api.Repositories
{
    public class AgentRepository : ICRUDtRepository<Agent>
    {
        private readonly SecurityDBContext context;

        public AgentRepository(SecurityDBContext context)
        {
            this.context = context;
        }
       
        public async Task<List<Agent>> GetAgents()
        {
            //var db = dbConnection();
            //var sql = @"SELECT * FROM agents";
            //return db.QueryAsync<Agent>(sql, new { });
            var agents = await context.agents.ToListAsync();
            return agents;
            
        }
        public async Task<Agent> GetDetails(int id)
        {
            //var db = dbConnection();
            //var sql = @"SELECT * FROM agents WHERE agentId =@id";
            //return await db.QueryFirstOrDefaultAsync<Agent>(sql, new { id = id })!;
            throw new NotImplementedException();

        }
        public async Task<bool> InsertAgent(Agent agent)
        {
           
            context.Add(agent);
            await context.SaveChangesAsync();
            return true;
           

        }
        public async Task<bool> UpdateAgent(Agent agent)
        {
            //var db = dbConnection();
            //var sql = @"UPDATE agents
            //            SET name = @Name, 
            //                lastname = @lastName,
            //                phone = @Phone,
            //                identification = @Identification,
            //                birthday = @Birthday, 
            //                status = @Status,
            //                rangeid = @RangeId
            //                WHERE agentId = @AgentId";
            //var result = await db.ExecuteAsync(sql, new
            //{
            //    agent.Name,
            //    agent.LastName,
            //    agent.Phone,
            //    agent.Identification,
            //    agent.BirthDay,
            //    agent.Status,
            //    agent.RangeId,
            //    agent.AgentId
            //});
            //return result > 0;
            throw new NotImplementedException();

        }
        public async Task<bool> DeleteAgent(Agent agent)
        {

            //var db = dbConnection();
            //var sql = @"DELETE FROM Agents WHERE agentId = @Id";
            //var result = await db.ExecuteAsync(sql, new { Id = agent.AgentId });
            //return result > 0;
            throw new NotImplementedException();

        }
        //public bool IdentificationExist(string identification)
        //{
        //    return GetAgents.Any();
        //}
    }
}

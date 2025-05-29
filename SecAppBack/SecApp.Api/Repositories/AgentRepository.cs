using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.Interfaces;
using SecApp.Api.Models;
using SecApp.Api.Utilities;

namespace SecApp.Api.Repositories
{
    public class AgentRepository : ICRUDtRepository<Agent>
    {
        private readonly SecurityDBContext context;
        private readonly IMapper mapper;

        public AgentRepository(SecurityDBContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<List<Agent>> GetAgents()
        {
            var agents = await context.agents.ToListAsync();
            return agents;
        }

        public async Task<Agent> GetDetails(int id)
        {
            var agent = await context.agents.FirstOrDefaultAsync(x => x.AgentId == id);

            return agent;

        }
        public async Task<bool> InsertAgent(Agent agent)
        {
           
            context.Add(agent);
            await context.SaveChangesAsync();
            return true;
           

        }
        public async Task<bool> UpdateAgent(Agent agent)
        {           
            context.agents.Update(agent);
            return await context.SaveChangesAsync() > 0;

        }
        public async Task<bool> DeleteAgent(int id)
        {

            var agentsDeteled = await context.agents.Where(x => x.AgentId == id).ExecuteDeleteAsync();
            return true;

        }
        //public bool IdentificationExist(string identification)
        //{
        //    return GetAgents.Any();
        //}
    }
}

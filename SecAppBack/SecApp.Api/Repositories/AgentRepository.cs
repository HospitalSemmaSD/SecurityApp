using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.Interfaces;
using SecApp.Api.Models;

namespace SecApp.Api.Repositories
{
    public class AgentRepository : ICRUDRepository<Agent>
    {
        private readonly SecurityDBContext context;
        private readonly IMapper mapper;

        public AgentRepository(SecurityDBContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public  async Task<IQueryable<Agent>> GetAll()
        {
            var agents =  context.Agents.AsQueryable();

            return agents;
        }

        public async Task<Agent> GetDetails(int id)
        {
            var agent = await context.Agents.FirstOrDefaultAsync(x => x.AgentId == id);

            return agent;

        }
        public async Task<bool> Insert(Agent agent)
        {
            context.Add(agent);
            return await context.SaveChangesAsync() > 0;

        }
        public async Task<bool> Update(Agent agent)
        {
            context.Agents.Update(agent);
            return await context.SaveChangesAsync() > 0;

        }
        public async Task<bool> Delete(int id)
        {

            var agentsDeteled = await context.Agents.Where(x => x.AgentId == id).ExecuteDeleteAsync();
            return true;

        }
        //public bool IdentificationExist(string identification)
        //{
        //    return GetAgents.Any();
        //}
    }
}

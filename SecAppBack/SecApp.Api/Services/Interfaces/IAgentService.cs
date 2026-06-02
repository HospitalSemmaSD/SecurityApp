using SecApp.Api.DTOs.AgentDTOs;
using SecApp.Api.DTOs.CommonDTOs;

namespace SecApp.Api.Services.Interfaces
{
    public interface IAgentService
    {
        Task<List<AgentDTO>> GetAgents(PaginationDTO pagination, HttpContext httpContext, bool? status = null);
        Task<AgentDTO?> GetAgentById(int id);
        Task<AgentDTO?> GetAgentByCode(string code);
        Task<AgentDTO?> GetAgentByIdentification(string identification);
        Task<List<AgentDTO>> SearchAgents(string query);
        Task<AgentDTO> CreateAgent(AgentCreateDTO agentDTO);
        Task UpdateAgent(int id, AgentCreateDTO agentCreateDTO);
        Task DeleteAgent(int id);
    }
}

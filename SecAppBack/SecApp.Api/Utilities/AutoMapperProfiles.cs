using AutoMapper;
using SecApp.Api.DTOs;
using SecApp.Api.Models;

namespace SecApp.Api.Utilities
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            AgentMappings();
        }

        private void AgentMappings()
        {
            CreateMap<Agent, AgentDTO>().ReverseMap();
            CreateMap<Agent, AgentCreateDTO>().ReverseMap();
         
        }
    }
}

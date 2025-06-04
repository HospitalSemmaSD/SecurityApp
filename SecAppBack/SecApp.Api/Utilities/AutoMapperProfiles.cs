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
            InstitutionMappings();
        }

        private void AgentMappings()
        {
            CreateMap<Agent, AgentDTO>().ReverseMap();
            CreateMap<Agent, AgentCreateDTO>().ReverseMap().ForMember(x => x.Photo, opt => opt.Ignore());

        }
        private void InstitutionMappings()
        {
            CreateMap<Institution, InstitutionDTO>().ReverseMap();
            CreateMap<Institution, InstitutionCreateDTO>().ReverseMap();
          //  CreateMap<ra, InstitutionCreateDTO>().ReverseMap();

        }
    }
}

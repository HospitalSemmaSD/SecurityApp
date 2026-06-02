using AutoMapper;
using SecApp.Api.Entities;
using SecApp.Api.DTOs.AgentDTOs;
using SecApp.Api.DTOs.InstitutionDTOs;
using Rank = SecApp.Api.Entities.Rank;
using SecApp.Api.DTOs.RankDTOs;
using SecApp.Api.DTOs.DutyRosterDTOs;


namespace SecApp.Api.Utilities
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Agent, AgentDTO>()
                .ForMember(dest => dest.RankName, opt => opt.MapFrom(src => src.Rank != null ? src.Rank.Name : string.Empty))
                .ForMember(dest => dest.InstitutionName, opt => opt.MapFrom(src => src.Rank != null && src.Rank.Institution != null ? src.Rank.Institution.Name : string.Empty))
                .ForMember(dest => dest.InstitutionId, opt => opt.MapFrom(src => src.Rank != null ? src.Rank.InstitutionId : 0));
            CreateMap<AgentCreateDTO, Agent>();

            CreateMap<Institution, InstitutionDTO>();
            CreateMap<Institution, InstitutionDTO>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id)).ReverseMap();
            CreateMap<InstitutionCreateDTO, Institution>();

            CreateMap<Rank, RankDTO>()
                         .ForMember(dto => dto.InstitutionName, ent => ent.MapFrom(prop => prop.Institution!.Name));
            CreateMap<RankCreateDTO, Rank>();
            CreateMap<RankDTO, Rank>();

            // Guardias / Duty Roster
            CreateMap<Shift, ShiftDTO>();
            CreateMap<ShiftCreateDTO, Shift>();

            CreateMap<DutyPost, DutyPostDTO>();
            CreateMap<DutyPostCreateDTO, DutyPost>();

            CreateMap<DutyAssignment, DutyAssignmentDTO>()
                .ForMember(d => d.AgentName, o => o.MapFrom(s => s.Agent != null ? s.Agent.FullName : string.Empty))
                .ForMember(d => d.AgentRank, o => o.MapFrom(s => s.Agent != null && s.Agent.Rank != null ? s.Agent.Rank.Name : string.Empty))
                .ForMember(d => d.AgentInstitution, o => o.MapFrom(s => s.Agent != null && s.Agent.Rank != null && s.Agent.Rank.Institution != null ? s.Agent.Rank.Institution.Name : string.Empty))
                .ForMember(d => d.AgentPhone, o => o.MapFrom(s => s.Agent != null ? s.Agent.Phone : string.Empty))
                .ForMember(d => d.ShiftName, o => o.MapFrom(s => s.Shift != null ? s.Shift.Name : string.Empty))
                .ForMember(d => d.ShiftTimeRange, o => o.MapFrom(s => s.Shift != null ? $"{s.Shift.StartTime:hh\\:mm} a {s.Shift.EndTime:hh\\:mm}" : string.Empty))
                .ForMember(d => d.DutyPostName, o => o.MapFrom(s => s.DutyPost != null ? s.DutyPost.Name : string.Empty));
            CreateMap<DutyAssignmentCreateDTO, DutyAssignment>();

            CreateMap<DepartmentResponsible, ResponsibleDTO>().ReverseMap();
            CreateMap<ResponsibleCreateDTO, DepartmentResponsible>();

            CreateMap<WeeklyRoster, WeeklyRosterDTO>();
        }
    }
}
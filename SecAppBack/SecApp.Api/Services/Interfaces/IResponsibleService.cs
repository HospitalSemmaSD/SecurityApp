using SecApp.Api.DTOs.DutyRosterDTOs;

namespace SecApp.Api.Services.Interfaces
{
    public interface IResponsibleService
    {
        Task<List<ResponsibleDTO>> GetResponsibles();
        Task<ResponsibleDTO> CreateResponsible(ResponsibleCreateDTO dto);
        Task UpdateResponsible(int id, ResponsibleCreateDTO dto);
        Task DeleteResponsible(int id);
        Task<List<ResponsibleDTO>> GetActiveResponsibles();
    }
}

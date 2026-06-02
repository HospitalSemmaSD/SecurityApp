using SecApp.Api.DTOs.InstitutionDTOs;

namespace SecApp.Api.Services.Interfaces
{
    public interface IInstitutionService
    {
        Task<List<InstitutionDTO>> GetInstitutions();
        Task<InstitutionDTO?> GetInstitutionById(int id);
        Task<InstitutionDTO> CreateInstitution(InstitutionCreateDTO institutionCreateDTO);
        Task UpdateInstitution(int id, InstitutionDTO institutionDTO);
        Task DeleteInstitution(int id);
    }
}

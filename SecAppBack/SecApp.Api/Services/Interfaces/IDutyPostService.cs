using SecApp.Api.DTOs.DutyRosterDTOs;

namespace SecApp.Api.Services.Interfaces
{
    public interface IDutyPostService
    {
        Task<List<DutyPostDTO>> GetDutyPosts();
        Task<DutyPostDTO?> GetDutyPostById(int id);
        Task<DutyPostDTO> CreateDutyPost(DutyPostCreateDTO postDTO);
        Task UpdateDutyPost(int id, DutyPostCreateDTO postDTO);
        Task DeleteDutyPost(int id);
    }
}

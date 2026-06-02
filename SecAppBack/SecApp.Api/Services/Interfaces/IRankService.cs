using SecApp.Api.DTOs.RankDTOs;

namespace SecApp.Api.Services.Interfaces
{
    public interface IRankService
    {
        Task<List<RankDTO>> GetRanks();
        Task<RankDTO?> GetRankById(int id);
        Task<List<RankDTO>> GetRanksByInstitution(int institutionId);
        Task<RankDTO> CreateRank(RankCreateDTO rankCreateDTO);
        Task UpdateRank(int id, RankDTO rankDTO);
        Task DeleteRank(int id);
    }
}

using SecApp.Api.DTOs.DutyRosterDTOs;

namespace SecApp.Api.Services.Interfaces
{
    public interface IDutyRosterService
    {
        Task<List<DutyAssignmentDTO>> GetRosterByWeek(DateTime startDate);
        Task<DutyAssignmentDTO> AssignAgent(DutyAssignmentCreateDTO assignmentDTO);
        Task RemoveAssignment(int id);
        Task<WeeklyRosterDTO?> GetRosterStatus(DateTime startDate);
        Task<WeeklyRosterDTO> CloseRoster(DateTime startDate);
        Task ReopenRoster(DateTime startDate);
        Task<List<DateTime>> GetRecentRostersDates();
        Task CloneRoster(DateTime fromDate, DateTime toDate);
        Task ClearRoster(DateTime date);
    }
}

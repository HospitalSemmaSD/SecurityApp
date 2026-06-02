using SecApp.Api.DTOs.DutyRosterDTOs;

namespace SecApp.Api.Services.Interfaces
{
    public interface IShiftService
    {
        Task<List<ShiftDTO>> GetShifts();
        Task<ShiftDTO?> GetShiftById(int id);
        Task<ShiftDTO> CreateShift(ShiftCreateDTO shiftDTO);
        Task UpdateShift(int id, ShiftCreateDTO shiftDTO);
        Task DeleteShift(int id);
    }
}

using AutoMapper;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.DTOs.DutyRosterDTOs;
using SecApp.Api.Entities;
using SecApp.Api.Interfaces;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Services
{
    public class ShiftService : IShiftService
    {
        private readonly IBaseRepository<Shift> _shiftRepository;
        private readonly IOutputCacheStore _outputCache;
        private readonly IMapper _mapper;
        private const string cacheTag = "shifts";

        public ShiftService(IBaseRepository<Shift> shiftRepository, IOutputCacheStore outputCache, IMapper mapper)
        {
            _shiftRepository = shiftRepository;
            _outputCache = outputCache;
            _mapper = mapper;
        }

        public async Task<List<ShiftDTO>> GetShifts()
        {
            var shifts = await _shiftRepository.GetAll().OrderBy(s => s.StartTime).ToListAsync();
            return _mapper.Map<List<ShiftDTO>>(shifts);
        }

        public async Task<ShiftDTO?> GetShiftById(int id)
        {
            var shift = await _shiftRepository.GetById(id);
            return _mapper.Map<ShiftDTO>(shift);
        }

        public async Task<ShiftDTO> CreateShift(ShiftCreateDTO shiftDTO)
        {
            var shift = _mapper.Map<Shift>(shiftDTO);
            await _shiftRepository.Insert(shift);
            await _outputCache.EvictByTagAsync(cacheTag, default);
            return _mapper.Map<ShiftDTO>(shift);
        }

        public async Task UpdateShift(int id, ShiftCreateDTO shiftDTO)
        {
            var shiftDB = await _shiftRepository.GetById(id);
            if (shiftDB == null) throw new KeyNotFoundException("Turno no encontrado.");

            _mapper.Map(shiftDTO, shiftDB);
            await _shiftRepository.Update(shiftDB);
            await _outputCache.EvictByTagAsync(cacheTag, default);
        }

        public async Task DeleteShift(int id)
        {
            await _shiftRepository.Delete(id);
            await _outputCache.EvictByTagAsync(cacheTag, default);
        }
    }
}

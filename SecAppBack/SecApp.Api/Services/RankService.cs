using AutoMapper;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.DTOs.RankDTOs;
using SecApp.Api.Entities;
using SecApp.Api.Interfaces;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Services
{
    public class RankService : IRankService
    {
        private readonly IBaseRepository<Rank> _repository;
        private readonly IOutputCacheStore _outputCache;
        private readonly IMapper _mapper;
        private const string CacheKey = "ranks";

        public RankService(IBaseRepository<Rank> repository, IOutputCacheStore outputCache, IMapper mapper)
        {
            _repository = repository;
            _outputCache = outputCache;
            _mapper = mapper;
        }

        public async Task<List<RankDTO>> GetRanks()
        {
            var ranks = await _repository.GetAll().ToListAsync();
            return _mapper.Map<List<RankDTO>>(ranks);
        }

        public async Task<RankDTO?> GetRankById(int id)
        {
            var rank = await _repository.GetById(id);
            if (rank is null) return null;
            return _mapper.Map<RankDTO>(rank);
        }

        public async Task<List<RankDTO>> GetRanksByInstitution(int institutionId)
        {
            var ranks = await _repository.Search(r => r.InstitutionId == institutionId);
            return _mapper.Map<List<RankDTO>>(ranks);
        }

        public async Task<RankDTO> CreateRank(RankCreateDTO rankCreateDTO)
        {
            var rank = _mapper.Map<Rank>(rankCreateDTO);
            await _repository.Insert(rank);
            await _outputCache.EvictByTagAsync(CacheKey, default);
            return _mapper.Map<RankDTO>(rank);
        }

        public async Task UpdateRank(int id, RankDTO rankDTO)
        {
            var existingRank = await _repository.GetById(id);
            if (existingRank is null) throw new KeyNotFoundException("Rango no encontrado.");

            _mapper.Map(rankDTO, existingRank);
            await _repository.Update(existingRank);
            await _outputCache.EvictByTagAsync(CacheKey, default);
        }

        public async Task DeleteRank(int id)
        {
            var rank = await _repository.GetById(id);
            if (rank is null) throw new KeyNotFoundException("Rango no encontrado.");

            await _repository.Delete(id);
            await _outputCache.EvictByTagAsync(CacheKey, default);
        }
    }
}

using AutoMapper;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.DTOs.InstitutionDTOs;
using SecApp.Api.Entities;
using SecApp.Api.Interfaces;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Services
{
    public class InstitutionService : IInstitutionService
    {
        private readonly IBaseRepository<Institution> _repository;
        private readonly IOutputCacheStore _outputCache;
        private readonly IMapper _mapper;
        private const string CacheTag = "institutions";

        public InstitutionService(IBaseRepository<Institution> repository, IOutputCacheStore outputCache, IMapper mapper)
        {
            _repository = repository;
            _outputCache = outputCache;
            _mapper = mapper;
        }

        public async Task<List<InstitutionDTO>> GetInstitutions()
        {
            var institutions = await _repository.GetAll().ToListAsync();
            return _mapper.Map<List<InstitutionDTO>>(institutions);
        }

        public async Task<InstitutionDTO?> GetInstitutionById(int id)
        {
            var institution = await _repository.GetById(id);
            if (institution is null) return null;
            return _mapper.Map<InstitutionDTO>(institution);
        }

        public async Task<InstitutionDTO> CreateInstitution(InstitutionCreateDTO institutionCreateDTO)
        {
            var institution = _mapper.Map<Institution>(institutionCreateDTO);
            await _repository.Insert(institution);
            await _outputCache.EvictByTagAsync(CacheTag, default);
            return _mapper.Map<InstitutionDTO>(institution);
        }

        public async Task UpdateInstitution(int id, InstitutionDTO institutionDTO)
        {
            var existingInstitution = await _repository.GetById(id);
            if (existingInstitution is null) throw new KeyNotFoundException("Institución no encontrada.");

            _mapper.Map(institutionDTO, existingInstitution);
            await _repository.Update(existingInstitution);
            await _outputCache.EvictByTagAsync(CacheTag, default);
        }

        public async Task DeleteInstitution(int id)
        {
            var institution = await _repository.GetById(id);
            if (institution is null) throw new KeyNotFoundException("Institución no encontrada.");

            await _repository.Delete(id);
            await _outputCache.EvictByTagAsync(CacheTag, default);
        }
    }
}

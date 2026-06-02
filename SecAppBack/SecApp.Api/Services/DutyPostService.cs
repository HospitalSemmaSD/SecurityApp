using AutoMapper;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.DTOs.DutyRosterDTOs;
using SecApp.Api.Entities;
using SecApp.Api.Interfaces;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Services
{
    public class DutyPostService : IDutyPostService
    {
        private readonly IBaseRepository<DutyPost> _repository;
        private readonly IOutputCacheStore _outputCache;
        private readonly IMapper _mapper;
        private const string cacheTag = "dutyposts";

        public DutyPostService(IBaseRepository<DutyPost> repository, IOutputCacheStore outputCache, IMapper mapper)
        {
            _repository = repository;
            _outputCache = outputCache;
            _mapper = mapper;
        }

        public async Task<List<DutyPostDTO>> GetDutyPosts()
        {
            var posts = await _repository.GetAll().OrderBy(p => p.Name).ToListAsync();
            return _mapper.Map<List<DutyPostDTO>>(posts);
        }

        public async Task<DutyPostDTO?> GetDutyPostById(int id)
        {
            var post = await _repository.GetById(id);
            return _mapper.Map<DutyPostDTO>(post);
        }

        public async Task<DutyPostDTO> CreateDutyPost(DutyPostCreateDTO postDTO)
        {
            var post = _mapper.Map<DutyPost>(postDTO);
            await _repository.Insert(post);
            await _outputCache.EvictByTagAsync(cacheTag, default);
            return _mapper.Map<DutyPostDTO>(post);
        }

        public async Task UpdateDutyPost(int id, DutyPostCreateDTO postDTO)
        {
            var postDB = await _repository.GetById(id);
            if (postDB == null) throw new KeyNotFoundException("Puesto no encontrado.");

            _mapper.Map(postDTO, postDB);
            await _repository.Update(postDB);
            await _outputCache.EvictByTagAsync(cacheTag, default);
        }

        public async Task DeleteDutyPost(int id)
        {
            await _repository.Delete(id);
            await _outputCache.EvictByTagAsync(cacheTag, default);
        }
    }
}

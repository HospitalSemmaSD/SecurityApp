using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.DTOs.DutyRosterDTOs;
using SecApp.Api.Entities;
using SecApp.Api.Interfaces;
using SecApp.Api.Services.Interfaces;

namespace SecApp.Api.Services
{
    public class ResponsibleService : IResponsibleService
    {
        private readonly IBaseRepository<DepartmentResponsible> _repository;
        private readonly IMapper _mapper;

        public ResponsibleService(IBaseRepository<DepartmentResponsible> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<ResponsibleDTO>> GetResponsibles()
        {
            var responsibles = await _repository.GetAll().ToListAsync();
            return _mapper.Map<List<ResponsibleDTO>>(responsibles);
        }

        public async Task<List<ResponsibleDTO>> GetActiveResponsibles()
        {
            var active = await _repository.GetAll().Where(r => r.IsActive).ToListAsync();
            return _mapper.Map<List<ResponsibleDTO>>(active);
        }

        public async Task<ResponsibleDTO> CreateResponsible(ResponsibleCreateDTO dto)
        {
            var entity = _mapper.Map<DepartmentResponsible>(dto);
            await _repository.Insert(entity);
            return _mapper.Map<ResponsibleDTO>(entity);
        }

        public async Task UpdateResponsible(int id, ResponsibleCreateDTO dto)
        {
            var db = await _repository.GetById(id);
            if (db == null) throw new KeyNotFoundException();
            _mapper.Map(dto, db);
            await _repository.Update(db);
        }

        public async Task DeleteResponsible(int id)
        {
            await _repository.Delete(id);
        }
    }
}

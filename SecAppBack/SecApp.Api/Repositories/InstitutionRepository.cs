using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SecApp.Api.Interfaces;
using SecApp.Api.Models;

namespace SecApp.Api.Repositories
{
    public class InstitutionRepository : ICRUDRepository<Institution>
    {
        private readonly SecurityDBContext context;
        private readonly IMapper mapper;

        public InstitutionRepository(SecurityDBContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public async Task<IQueryable<Institution>> GetAll()
        {
            var institutions = await context.Institutions.ToListAsync();
            return institutions.AsQueryable();
        }

        public async Task<Institution> GetDetails(int id)
        {
            var institution = await context.Institutions.FirstOrDefaultAsync(x => x.InstitutionId == id);
            return institution;
        }

        public async Task<bool> Insert(Institution institution)
        {
            context.Add(institution);
            return await context.SaveChangesAsync().ContinueWith(static t => t.Result > 0);

        }

        public async Task<bool> Update(Institution institution)
        {
            context.Institutions.Update(institution);
            return await context.SaveChangesAsync().ContinueWith(static t => t.Result > 0);
        }
        public async Task<bool> Delete(int id)
        {
            var institutionsDeleted = context.Institutions.Where(x => x.InstitutionId == id).ExecuteDeleteAsync();
            return await institutionsDeleted.ContinueWith(static t => t.Result > 0);
        }
    }
}

using MatCron.Backend.Repositories.Interfaces;
using Backend.Data;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace MatCron.Backend.Repositories.Implementations
{
    public class MattressTypeRepository : IMattressTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public MattressTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MattressType>> GetAllMattressTypesAsync()
        {
            return await _context.MattressTypes
                .AsNoTracking()
                .ToListAsync();
        }
        
        public async Task<IEnumerable<MattressTypeTileDTO>> GetMattressTypeSummariesAsync()
        {
            return await _context.MattressTypes
                .AsNoTracking()
                .Select(mt => new MattressTypeTileDTO
                {
                    Id = mt.Id,
                    Name = mt.Name,
                    Width = mt.Width,
                    Length = mt.Length,
                    Height = mt.Height,
                    Stock = mt.Stock
                })
                .ToListAsync();
        }
    }
}
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
        
        public async Task<MattressTypeDTO?> GetMattressTypeByIdAsync(Guid id)
        {
            var mattressType = await _context.MattressTypes.AsNoTracking().FirstOrDefaultAsync(mt => mt.Id == id);
            if (mattressType == null) return null;

            return new MattressTypeDTO
            {
                Id = mattressType.Id,
                Name = mattressType.Name,
                Width = mattressType.Width,
                Length = mattressType.Length,
                Height = mattressType.Height,
                Composition = mattressType.Composition,
                Washable = mattressType.Washable,
                RotationInterval = mattressType.RotationInterval,
                RecyclingDetails = mattressType.RecyclingDetails,
                ExpectedLifespan = mattressType.ExpectedLifespan,
                WarrantyPeriod = mattressType.WarrantyPeriod,
                Stock = mattressType.Stock
            };
        }
    }
}
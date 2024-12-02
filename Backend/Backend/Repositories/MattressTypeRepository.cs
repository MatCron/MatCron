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
        
        public async Task<string> AddMattressTypeAsync(MattressTypeDTO mattressTypeDto)
        {
            try
            {
                // Validation: Check if a mattress type with the same name already exists
                var existingByName = await _context.MattressTypes
                    .AsNoTracking()
                    .FirstOrDefaultAsync(mt => mt.Name.ToLower() == mattressTypeDto.Name.ToLower());

                if (existingByName != null)
                {
                    return $"A mattress type with the name '{mattressTypeDto.Name}' already exists.";
                }

                // Validation: Check if a mattress type with the same dimensions already exists
                var existingByDimensions = await _context.MattressTypes
                    .AsNoTracking()
                    .FirstOrDefaultAsync(mt =>
                        mt.Width == mattressTypeDto.Width &&
                        mt.Length == mattressTypeDto.Length &&
                        mt.Height == mattressTypeDto.Height);

                if (existingByDimensions != null)
                {
                    return "A mattress type with the same dimensions (Width, Length, Height) already exists.";
                }

                // Create a new mattress type entity from DTO
                var newMattressType = new MattressType
                {
                    Id = Guid.NewGuid(),
                    Name = mattressTypeDto.Name,
                    Width = mattressTypeDto.Width,
                    Length = mattressTypeDto.Length,
                    Height = mattressTypeDto.Height,
                    Composition = mattressTypeDto.Composition,
                    Washable = mattressTypeDto.Washable,
                    RotationInterval = mattressTypeDto.RotationInterval,
                    RecyclingDetails = mattressTypeDto.RecyclingDetails,
                    ExpectedLifespan = mattressTypeDto.ExpectedLifespan,
                    WarrantyPeriod = mattressTypeDto.WarrantyPeriod,
                    Stock = mattressTypeDto.Stock
                };

                // Add the mattress type to the database
                _context.MattressTypes.Add(newMattressType);
                await _context.SaveChangesAsync();

                return "Mattress type added successfully.";
            }
            catch (Exception ex)
            {
                // Log exception for debugging purposes (optional)
                Console.WriteLine($"Error adding mattress type: {ex.Message}");
                return $"Failed to add mattress type: {ex.Message}";
            }
        }
    }
}
using MatCron.Backend.Repositories.Interfaces;

using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using MatCron.Backend.Common;
using Microsoft.EntityFrameworkCore;
using System;
using MatCron.Backend.Data;


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
            try
            {
                return await _context.MattressTypes
                    .AsNoTracking()
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllMattressTypesAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<MattressTypeTileDTO>> GetMattressTypeSummariesAsync()
        {
            try
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
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetMattressTypeSummariesAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<MattressTypeDTO?> GetMattressTypeByIdAsync(Guid id)
        {
            try
            {
                var mattressType = await _context.MattressTypes
                    .AsNoTracking()
                    .FirstOrDefaultAsync(mt => mt.Id == id);

                return mattressType == null ? null : MattressTypeConverter.ConvertToDto(mattressType);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetMattressTypeByIdAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<string> AddMattressTypeAsync(MattressTypeDTO dto)
        {
            try
            {
                // Validation
                if (await _context.MattressTypes.AnyAsync(mt => mt.Name.ToLower() == dto.Name.ToLower()))
                {
                    return $"A mattress type with the name '{dto.Name}' already exists.";
                }

                if (await _context.MattressTypes.AnyAsync(mt => mt.Width == dto.Width && mt.Length == dto.Length && mt.Height == dto.Height))
                {
                    return "A mattress type with the same dimensions (Width, Length, Height) already exists.";
                }

                // Convert and add
                var newMattressType = MattressTypeConverter.ConvertToEntity(dto);
                _context.MattressTypes.Add(newMattressType);
                await _context.SaveChangesAsync();

                return "Mattress type added successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddMattressTypeAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<string> EditMattressTypeAsync(MattressTypeDTO dto)
        {
            try
            {
                var existingMattressType = await _context.MattressTypes
                    .FirstOrDefaultAsync(mt => mt.Id == dto.Id);

                if (existingMattressType == null)
                {
                    return "Mattress type not found.";
                }

                // Validation
                if (await _context.MattressTypes.AnyAsync(mt => mt.Name.ToLower() == dto.Name.ToLower() && mt.Id != dto.Id))
                {
                    return $"A mattress type with the name '{dto.Name}' already exists.";
                }

                if (await _context.MattressTypes.AnyAsync(mt => mt.Width == dto.Width && mt.Length == dto.Length && mt.Height == dto.Height && mt.Id != dto.Id))
                {
                    return "A mattress type with the same dimensions (Width, Length, Height) already exists.";
                }

                // Update using Converter
                MattressTypeConverter.UpdateEntityFromDto(existingMattressType, dto);
                _context.MattressTypes.Update(existingMattressType);
                await _context.SaveChangesAsync();

                return "Mattress type updated successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in EditMattressTypeAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<string> DeleteMattressTypeAsync(Guid id)
        {
            try
            {
                var existingMattressType = await _context.MattressTypes
                    .FirstOrDefaultAsync(mt => mt.Id == id);

                if (existingMattressType == null)
                {
                    return "Mattress type not found.";
                }

                // Placeholder: Check if mattresses are attached
                /*
                if (await _context.Mattresses.AnyAsync(m => m.MattressTypeId == id))
                {
                    return "Cannot delete this mattress type as there are mattresses attached to it.";
                }
                */

                _context.MattressTypes.Remove(existingMattressType);
                await _context.SaveChangesAsync();

                return "Mattress type deleted successfully.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteMattressTypeAsync: {ex.Message}");
                throw;
            }
        }
    }
}
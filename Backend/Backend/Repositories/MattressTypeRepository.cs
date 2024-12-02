// // using MatCron.Backend.Repositories.Interfaces;
// // using Backend.Data;
// // using MatCron.Backend.DTOs;
// // using MatCron.Backend.Entities;
// // using Microsoft.EntityFrameworkCore;
// //
// // namespace MatCron.Backend.Repositories.Implementations
// // {
// //     public class MattressTypeRepository : IMattressTypeRepository
// //     {
// //         private readonly ApplicationDbContext _context;
// //
// //         public MattressTypeRepository(ApplicationDbContext context)
// //         {
// //             _context = context;
// //         }
// //
// //         public async Task<IEnumerable<MattressType>> GetAllMattressTypesAsync()
// //         {
// //             return await _context.MattressTypes
// //                 .AsNoTracking()
// //                 .ToListAsync();
// //         }
// //         
// //         public async Task<IEnumerable<MattressTypeTileDTO>> GetMattressTypeSummariesAsync()
// //         {
// //             return await _context.MattressTypes
// //                 .AsNoTracking()
// //                 .Select(mt => new MattressTypeTileDTO
// //                 {
// //                     Id = mt.Id,
// //                     Name = mt.Name,
// //                     Width = mt.Width,
// //                     Length = mt.Length,
// //                     Height = mt.Height,
// //                     Stock = mt.Stock
// //                 })
// //                 .ToListAsync();
// //         }
// //         
// //         public async Task<MattressTypeDTO?> GetMattressTypeByIdAsync(Guid id)
// //         {
// //             var mattressType = await _context.MattressTypes.AsNoTracking().FirstOrDefaultAsync(mt => mt.Id == id);
// //             if (mattressType == null) return null;
// //
// //             return new MattressTypeDTO
// //             {
// //                 Id = mattressType.Id,
// //                 Name = mattressType.Name,
// //                 Width = mattressType.Width,
// //                 Length = mattressType.Length,
// //                 Height = mattressType.Height,
// //                 Composition = mattressType.Composition,
// //                 Washable = mattressType.Washable,
// //                 RotationInterval = mattressType.RotationInterval,
// //                 RecyclingDetails = mattressType.RecyclingDetails,
// //                 ExpectedLifespan = mattressType.ExpectedLifespan,
// //                 WarrantyPeriod = mattressType.WarrantyPeriod,
// //                 Stock = mattressType.Stock
// //             };
// //         }
// //         
// //         public async Task<string> AddMattressTypeAsync(MattressTypeDTO mattressTypeDto)
// //         {
// //             try
// //             {
// //                 // Validation: Check if a mattress type with the same name already exists
// //                 var existingByName = await _context.MattressTypes
// //                     .AsNoTracking()
// //                     .FirstOrDefaultAsync(mt => mt.Name.ToLower() == mattressTypeDto.Name.ToLower());
// //
// //                 if (existingByName != null)
// //                 {
// //                     return $"A mattress type with the name '{mattressTypeDto.Name}' already exists.";
// //                 }
// //
// //                 // Validation: Check if a mattress type with the same dimensions already exists
// //                 var existingByDimensions = await _context.MattressTypes
// //                     .AsNoTracking()
// //                     .FirstOrDefaultAsync(mt =>
// //                         mt.Width == mattressTypeDto.Width &&
// //                         mt.Length == mattressTypeDto.Length &&
// //                         mt.Height == mattressTypeDto.Height);
// //
// //                 if (existingByDimensions != null)
// //                 {
// //                     return "A mattress type with the same dimensions (Width, Length, Height) already exists.";
// //                 }
// //
// //                 // Create a new mattress type entity from DTO
// //                 var newMattressType = new MattressType
// //                 {
// //                     Id = Guid.NewGuid(),
// //                     Name = mattressTypeDto.Name,
// //                     Width = mattressTypeDto.Width,
// //                     Length = mattressTypeDto.Length,
// //                     Height = mattressTypeDto.Height,
// //                     Composition = mattressTypeDto.Composition,
// //                     Washable = mattressTypeDto.Washable,
// //                     RotationInterval = mattressTypeDto.RotationInterval,
// //                     RecyclingDetails = mattressTypeDto.RecyclingDetails,
// //                     ExpectedLifespan = mattressTypeDto.ExpectedLifespan,
// //                     WarrantyPeriod = mattressTypeDto.WarrantyPeriod,
// //                     Stock = mattressTypeDto.Stock
// //                 };
// //
// //                 // Add the mattress type to the database
// //                 _context.MattressTypes.Add(newMattressType);
// //                 await _context.SaveChangesAsync();
// //
// //                 return "Mattress type added successfully.";
// //             }
// //             catch (Exception ex)
// //             {
// //                 // Log exception for debugging purposes (optional)
// //                 Console.WriteLine($"Error adding mattress type: {ex.Message}");
// //                 return $"Failed to add mattress type: {ex.Message}";
// //             }
// //         }
// //         public async Task<string> EditMattressTypeAsync(MattressTypeDTO mattressTypeDto)
// //         {
// //             try
// //             {
// //                 // Check if the mattress type exists
// //                 var existingMattressType = await _context.MattressTypes
// //                     .FirstOrDefaultAsync(mt => mt.Id == mattressTypeDto.Id);
// //
// //                 if (existingMattressType == null)
// //                 {
// //                     return "Mattress type not found.";
// //                 }
// //
// //                 // Validation: Check if any other mattress type has the same name
// //                 var existingByName = await _context.MattressTypes
// //                     .AsNoTracking()
// //                     .FirstOrDefaultAsync(mt =>
// //                         mt.Name.ToLower() == mattressTypeDto.Name.ToLower() &&
// //                         mt.Id != mattressTypeDto.Id);
// //
// //                 if (existingByName != null)
// //                 {
// //                     return $"A mattress type with the name '{mattressTypeDto.Name}' already exists.";
// //                 }
// //
// //                 // Validation: Check if any other mattress type has the same dimensions
// //                 var existingByDimensions = await _context.MattressTypes
// //                     .AsNoTracking()
// //                     .FirstOrDefaultAsync(mt =>
// //                         mt.Width == mattressTypeDto.Width &&
// //                         mt.Length == mattressTypeDto.Length &&
// //                         mt.Height == mattressTypeDto.Height &&
// //                         mt.Id != mattressTypeDto.Id);
// //
// //                 if (existingByDimensions != null)
// //                 {
// //                     return "A mattress type with the same dimensions (Width, Length, Height) already exists.";
// //                 }
// //
// //                 // Update the existing mattress type
// //                 existingMattressType.Name = mattressTypeDto.Name;
// //                 existingMattressType.Width = mattressTypeDto.Width;
// //                 existingMattressType.Length = mattressTypeDto.Length;
// //                 existingMattressType.Height = mattressTypeDto.Height;
// //                 existingMattressType.Composition = mattressTypeDto.Composition;
// //                 existingMattressType.Washable = mattressTypeDto.Washable;
// //                 existingMattressType.RotationInterval = mattressTypeDto.RotationInterval;
// //                 existingMattressType.RecyclingDetails = mattressTypeDto.RecyclingDetails;
// //                 existingMattressType.ExpectedLifespan = mattressTypeDto.ExpectedLifespan;
// //                 existingMattressType.WarrantyPeriod = mattressTypeDto.WarrantyPeriod;
// //                 existingMattressType.Stock = mattressTypeDto.Stock;
// //
// //                 _context.MattressTypes.Update(existingMattressType);
// //                 await _context.SaveChangesAsync();
// //
// //                 return "Mattress type updated successfully.";
// //             }
// //             catch (Exception ex)
// //             {
// //                 // Log exception for debugging (optional)
// //                 Console.WriteLine($"Error updating mattress type: {ex.Message}");
// //                 return $"Failed to update mattress type: {ex.Message}";
// //             }
// //         }
// //         
// //         public async Task<string> DeleteMattressTypeAsync(Guid mattressTypeId)
// //         {
// //             try
// //             {
// //                 // Check if the mattress type exists
// //                 var existingMattressType = await _context.MattressTypes
// //                     .FirstOrDefaultAsync(mt => mt.Id == mattressTypeId);
// //
// //                 if (existingMattressType == null)
// //                 {
// //                     return "Mattress type not found.";
// //                 }
// //
// //                 // Validation: Check if any mattresses are attached to this mattress type (placeholder)
// //                 /*
// //                 var hasAttachedMattresses = await _context.Mattresses
// //                     .AnyAsync(m => m.MattressTypeId == mattressTypeId);
// //
// //                 if (hasAttachedMattresses)
// //                 {
// //                     return "Cannot delete this mattress type as there are mattresses attached to it.";
// //                 }
// //                 */
// //
// //                 // Delete the mattress type
// //                 _context.MattressTypes.Remove(existingMattressType);
// //                 await _context.SaveChangesAsync();
// //
// //                 return "Mattress type deleted successfully.";
// //             }
// //             catch (Exception ex)
// //             {
// //                 // Log exception for debugging (optional)
// //                 Console.WriteLine($"Error deleting mattress type: {ex.Message}");
// //                 return $"Failed to delete mattress type: {ex.Message}";
// //             }
// //         }
// //         
// //         
// //     }
// // }
//
//
//
// using MatCron.Backend.Repositories.Interfaces;
// using Backend.Data;
// using MatCron.Backend.DTOs;
// using MatCron.Backend.Entities;
// using MatCron.Backend.Common;
// using Microsoft.EntityFrameworkCore;
//
// namespace MatCron.Backend.Repositories.Implementations
// {
//     public class MattressTypeRepository : IMattressTypeRepository
//     {
//         private readonly ApplicationDbContext _context;
//
//         public MattressTypeRepository(ApplicationDbContext context)
//         {
//             _context = context;
//         }
//
//         public async Task<IEnumerable<MattressType>> GetAllMattressTypesAsync()
//         {
//             return await _context.MattressTypes
//                 .AsNoTracking()
//                 .ToListAsync();
//         }
//
//         public async Task<IEnumerable<MattressTypeTileDTO>> GetMattressTypeSummariesAsync()
//         {
//             return await _context.MattressTypes
//                 .AsNoTracking()
//                 .Select(mt => new MattressTypeTileDTO
//                 {
//                     Id = mt.Id,
//                     Name = mt.Name,
//                     Width = mt.Width,
//                     Length = mt.Length,
//                     Height = mt.Height,
//                     Stock = mt.Stock
//                 })
//                 .ToListAsync();
//         }
//
//         public async Task<MattressTypeDTO?> GetMattressTypeByIdAsync(Guid id)
//         {
//             var mattressType = await _context.MattressTypes
//                 .AsNoTracking()
//                 .FirstOrDefaultAsync(mt => mt.Id == id);
//
//             return mattressType == null ? null : MattressTypeConverter.ConvertToDto(mattressType);
//         }
//
//         public async Task<string> AddMattressTypeAsync(MattressTypeDTO dto)
//         {
//             try
//             {
//                 // Validation
//                 if (await _context.MattressTypes.AnyAsync(mt => mt.Name.ToLower() == dto.Name.ToLower()))
//                 {
//                     return $"A mattress type with the name '{dto.Name}' already exists.";
//                 }
//
//                 if (await _context.MattressTypes.AnyAsync(mt => mt.Width == dto.Width && mt.Length == dto.Length && mt.Height == dto.Height))
//                 {
//                     return "A mattress type with the same dimensions (Width, Length, Height) already exists.";
//                 }
//
//                 // Convert and add
//                 var newMattressType = MattressTypeConverter.ConvertToEntity(dto);
//                 _context.MattressTypes.Add(newMattressType);
//                 await _context.SaveChangesAsync();
//
//                 return "Mattress type added successfully.";
//             }
//             catch (Exception ex)
//             {
//                 Console.WriteLine($"Error adding mattress type: {ex.Message}");
//                 return $"Failed to add mattress type: {ex.Message}";
//             }
//         }
//
//         public async Task<string> EditMattressTypeAsync(MattressTypeDTO dto)
//         {
//             try
//             {
//                 var existingMattressType = await _context.MattressTypes
//                     .FirstOrDefaultAsync(mt => mt.Id == dto.Id);
//
//                 if (existingMattressType == null)
//                 {
//                     return "Mattress type not found.";
//                 }
//
//                 // Validation
//                 if (await _context.MattressTypes.AnyAsync(mt => mt.Name.ToLower() == dto.Name.ToLower() && mt.Id != dto.Id))
//                 {
//                     return $"A mattress type with the name '{dto.Name}' already exists.";
//                 }
//
//                 if (await _context.MattressTypes.AnyAsync(mt => mt.Width == dto.Width && mt.Length == dto.Length && mt.Height == dto.Height && mt.Id != dto.Id))
//                 {
//                     return "A mattress type with the same dimensions (Width, Length, Height) already exists.";
//                 }
//
//                 // Convert and update
//                 MattressTypeConverter.UpdateEntityFromDto(existingMattressType, dto);
//                 _context.MattressTypes.Update(existingMattressType);
//                 await _context.SaveChangesAsync();
//
//                 return "Mattress type updated successfully.";
//             }
//             catch (Exception ex)
//             {
//                 Console.WriteLine($"Error updating mattress type: {ex.Message}");
//                 return $"Failed to update mattress type: {ex.Message}";
//             }
//         }
//
//         public async Task<string> DeleteMattressTypeAsync(Guid id)
//         {
//             try
//             {
//                 var existingMattressType = await _context.MattressTypes
//                     .FirstOrDefaultAsync(mt => mt.Id == id);
//
//                 if (existingMattressType == null)
//                 {
//                     return "Mattress type not found.";
//                 }
//
//                 // Validation: Placeholder for checking attached mattresses
//                 /*
//                 if (await _context.Mattresses.AnyAsync(m => m.MattressTypeId == id))
//                 {
//                     return "Cannot delete this mattress type as there are mattresses attached to it.";
//                 }
//                 */
//
//                 _context.MattressTypes.Remove(existingMattressType);
//                 await _context.SaveChangesAsync();
//
//                 return "Mattress type deleted successfully.";
//             }
//             catch (Exception ex)
//             {
//                 Console.WriteLine($"Error deleting mattress type: {ex.Message}");
//                 return $"Failed to delete mattress type: {ex.Message}";
//             }
//         }
//     }
// }



using MatCron.Backend.Repositories.Interfaces;
using Backend.Data;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using MatCron.Backend.Common;
using Microsoft.EntityFrameworkCore;
using System;

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

        public async Task GetMattressTypeByIdAsync(Guid id)
        {
            try
            {
                var mattressType = await _context.MattressTypes
                    .AsNoTracking()
                    .FirstOrDefaultAsync(mt => mt.Id == id);
                //
                // return mattressType == null ? null : MattressTypeConverter.ConvertToDto(mattressType);
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
                // var newMattressType = MattressTypeConverter.ConvertToEntity(dto);
                // _context.MattressTypes.Add(newMattressType);
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
                // MattressTypeConverter.UpdateEntityFromDto(existingMattressType, dto);
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
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using System;

namespace MatCron.Backend.Common
{
    public static class MattressTypeConverter
    {
        public static MattressType ConvertToEntity(MattressTypeDTO dto)
        {
            try
            {
                if (dto == null) throw new ArgumentNullException(nameof(dto), "DTO cannot be null.");

                return new MattressType
                {
                    Id = Guid.NewGuid(),
                    Name = dto.Name,
                    Width = dto.Width,
                    Length = dto.Length,
                    Height = dto.Height,
                    Composition = dto.Composition,
                    Washable = dto.Washable,
                    RotationInterval = dto.RotationInterval,
                    RecyclingDetails = dto.RecyclingDetails,
                    ExpectedLifespan = dto.ExpectedLifespan,
                    WarrantyPeriod = dto.WarrantyPeriod,
                    Stock = dto.Stock
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ConvertToEntity: {ex.Message}");
                throw;
            }
        }

        public static void UpdateEntityFromDto(MattressType existingEntity, MattressTypeDTO dto)
        {
            try
            {
                if (existingEntity == null) throw new ArgumentNullException(nameof(existingEntity), "Existing entity cannot be null.");
                if (dto == null) throw new ArgumentNullException(nameof(dto), "DTO cannot be null.");

                existingEntity.Name = dto.Name;
                existingEntity.Width = dto.Width;
                existingEntity.Length = dto.Length;
                existingEntity.Height = dto.Height;
                existingEntity.Composition = dto.Composition;
                existingEntity.Washable = dto.Washable;
                existingEntity.RotationInterval = dto.RotationInterval;
                existingEntity.RecyclingDetails = dto.RecyclingDetails;
                existingEntity.ExpectedLifespan = dto.ExpectedLifespan;
                existingEntity.WarrantyPeriod = dto.WarrantyPeriod;
                existingEntity.Stock = dto.Stock;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateEntityFromDto: {ex.Message}");
                throw;
            }
        }

        public static MattressTypeDTO ConvertToDto(MattressType entity)
        {
            try
            {
                if (entity == null) throw new ArgumentNullException(nameof(entity), "Entity cannot be null.");

                return new MattressTypeDTO
                {
                    Id = entity.Id,
                    Name = entity.Name,
                    Width = entity.Width,
                    Length = entity.Length,
                    Height = entity.Height,
                    Composition = entity.Composition,
                    Washable = entity.Washable,
                    RotationInterval = entity.RotationInterval,
                    RecyclingDetails = entity.RecyclingDetails,
                    ExpectedLifespan = entity.ExpectedLifespan,
                    WarrantyPeriod = entity.WarrantyPeriod,
                    Stock = entity.Stock
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ConvertToDto: {ex.Message}");
                throw;
            }
        }
    }
}
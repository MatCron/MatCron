using Backend.DTOs.Mattress;
using MatCron.Backend.Entities;

namespace Backend.Common.Converters
{
    public class MattressConverter
    {
        public static Mattress ConvertToEntity(MattressDto dto)
        {
            try
            {
                if (dto == null) throw new ArgumentNullException(nameof(dto), "DTO cannot be null.");

                return new Mattress
                {
                    Uid = Guid.NewGuid(),
                    MattressTypeId = Guid.Parse(dto.MattressTypeId),
                    BatchNo = dto.BatchNo,
                    ProductionDate = dto.ProductionDate,
                    OrgId = Guid.Parse(dto.OrgId),
                    EpcCode = dto.EpcCode,
                    Status = (byte) (dto.Status ?? 0),
                    LifeCyclesEnd = dto.LifeCyclesEnd,
                    DaysToRotate = dto.DaysToRotate ?? 0
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ConvertToEntity: {ex.Message}");
                throw;
            }
        }

        public static void UpdateEntityFromDto(Mattress existingEntity, MattressDto dto)
        {
            try
            {
                if (existingEntity == null) throw new ArgumentNullException(nameof(existingEntity), "Existing entity cannot be null.");
                if (dto == null) throw new ArgumentNullException(nameof(dto), "DTO cannot be null.");

                existingEntity.MattressTypeId = Guid.Parse(dto.MattressTypeId);
                existingEntity.BatchNo = dto.BatchNo;
                existingEntity.ProductionDate = dto.ProductionDate;
                existingEntity.OrgId = Guid.Parse(dto.OrgId);
                existingEntity.EpcCode = dto.EpcCode;
                existingEntity.Status = (byte) (dto.Status ?? 0);
                existingEntity.LifeCyclesEnd = dto.LifeCyclesEnd;
                existingEntity.DaysToRotate = dto.DaysToRotate ?? 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateEntityFromDto: {ex.Message}");
                throw;
            }
        }

        public static MattressDto ConvertToDto(Mattress entity)
        {
            try
            {
                if (entity == null) throw new ArgumentNullException(nameof(entity), "Entity cannot be null.");

                return new MattressDto
                {
                    Uid = entity.Uid.ToString(),
                    MattressTypeId = entity.MattressTypeId.ToString(),
                    BatchNo = entity.BatchNo,
                    ProductionDate = entity.ProductionDate,
                    OrgId = entity.OrgId.ToString(),
                    EpcCode = entity.EpcCode,
                    Status = entity.Status,
                    LifeCyclesEnd = entity.LifeCyclesEnd,
                    DaysToRotate = entity.DaysToRotate,
                    location = entity.Location,
                    MattressTypeName = entity.MattressType?.Name
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

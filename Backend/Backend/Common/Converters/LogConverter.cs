using Backend.DTOs.Log;
using MatCron.Backend.Entities;

namespace Backend.Common.Converters
{
    public class LogConverter
    {
        public static LogDTO EntityToDTO(LogMattress entity)
        {
            return new LogDTO
            {
                Id = entity.Id.ToString(),
                MattressId = entity.ObjectId.ToString(),
                Status = entity.Status != null ? entity.Status : (byte) 9,
                Details = entity.Details ?? "N/A",
                Type = entity.Type != null ? entity.Type : (byte) 9,
                TimeStamp = entity.TimeStamp.ToString()
            };
        }
    }
}

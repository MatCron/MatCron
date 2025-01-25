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
                MattressId = entity.MattressId.ToString(),
                Status = entity.Status == null ? entity.Status : (byte) 9,
                Details = entity.Details ?? "N/A",
                Type = entity.Type ?? "N/A",
                TimeStamp = entity.TimeStamp.ToString()
            };
        }
    }
}

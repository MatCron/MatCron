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
                Status = entity.Status,
                Details = entity.Details,
                Type = entity.Type,
                TimeStamp = entity.TimeStamp.ToString()
            };
        }
    }
}

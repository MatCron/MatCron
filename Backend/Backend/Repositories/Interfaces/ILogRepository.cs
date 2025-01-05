using MatCron.Backend.Entities;

namespace Backend.Repositories.Interfaces
{
    public interface ILogRepository
    {
        Task<List<LogMattress>> GetAllLogsOfMattress(string id);
        Task<LogMattress> AddLogMattress(LogMattress log);
    }
}

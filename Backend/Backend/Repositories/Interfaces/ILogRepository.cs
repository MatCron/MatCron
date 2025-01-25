﻿using Backend.DTOs.Log;
using MatCron.Backend.Entities;

namespace Backend.Repositories.Interfaces
{
    public interface ILogRepository
    {
        Task<List<LogDTO>> GetAllLogsOfMattress(string id);
        Task<LogMattress> AddLogMattress(LogMattress log);
    }
}

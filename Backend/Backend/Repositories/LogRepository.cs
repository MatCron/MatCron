﻿using Backend.Common.Converters;
using Backend.Common.Enums;
using Backend.DTOs.Log;
using Backend.Repositories.Interfaces;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class LogRepository : ILogRepository
    {
        private readonly ApplicationDbContext _context;
        public LogRepository(ApplicationDbContext applicationDbContext)
        {
            _context = applicationDbContext;
        }

        public async Task<List<LogDTO>> GetAllLogsOfMattress(string mattressId)
        {
            try
            {
                // Validate the mattressId
                if (!Guid.TryParse(mattressId, out Guid parsedMattressId))
                {
                    throw new ArgumentException("Invalid MattressId format.");
                }

                // Retrieve logs from the database
                List<LogMattress>? logs = await _context.LogMattresses.Where(logs => logs.ObjectId == parsedMattressId).ToListAsync();

                // Log the count of logs retrieved (for debugging purposes)
                Console.WriteLine($"Retrieved logs for MattressId {mattressId}.");

                // Convert the logs to DTOs
                List<LogDTO> result = logs.Select(log => LogConverter.EntityToDTO(log)).ToList();

                return result;
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception($"An error occurred: {ex.Message}");
            }
        }

        public async Task<List<LogDTO>> GetAllLogsOfGroups(Guid objectId)
        {
            try
            {

                List<LogMattress>? log = await _context.LogMattresses.Where(log => log.ObjectId == objectId && log.Type == (byte)LogType.group).ToListAsync();

                List<LogDTO> result = log.Select(log => LogConverter.EntityToDTO(log)).ToList();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving logs: {ex}");

                throw new Exception($"An error occurred: {ex.Message}");

            }
        }

        public async Task<LogMattress> AddLogMattress(LogMattress log)
        {
            try
            {
                _context.LogMattresses.Add(log);
                await _context.SaveChangesAsync();
                return log;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding log: {ex.Message}");
                throw new Exception($"An error occurred: {ex.Message}");
            }
        }

        public async void DeleteAllLogMattress(string id)
        {
            try
            {
                await _context.LogMattresses.Where(l => l.ObjectId == Guid.Parse(id)).ForEachAsync(l => _context.LogMattresses.Remove(l));
                await _context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting logs: {ex.Message}");
                throw new Exception($"An error occurred: {ex.Message}");
            }
        }
    }
}

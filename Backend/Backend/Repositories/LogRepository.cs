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

        public async Task<List<LogMattress>> GetAllLogsOfMattress(string MattressId)
        {
            try
            {
                var logs = await _context.LogMattresses.Where(l => l.MattressId == Guid.Parse(MattressId)).ToListAsync();
                return logs;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving logs: {ex.Message}");
                throw new Exception($"An error occurred: {ex.Message}");
            }
        }

        public async void AddLogMattress(LogMattress log)
        {
            try
            {
                _context.LogMattresses.Add(log);
                await _context.SaveChangesAsync();
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
                await _context.LogMattresses.Where(l => l.MattressId == Guid.Parse(id)).ForEachAsync(l => _context.LogMattresses.Remove(l));
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

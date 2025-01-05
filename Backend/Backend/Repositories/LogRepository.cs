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

        public async Task<List<LogMattress>> GetAllLogsOfMattress(string mattressId)
        {
            try
            {
                // Validate the mattressId
                if (!Guid.TryParse(mattressId, out Guid parsedMattressId))
                {
                    throw new ArgumentException("Invalid MattressId format.");
                }

                // Retrieve logs from the database
                var logs = await _context.LogMattresses
                    .Where(log => log.MattressId == parsedMattressId)
                    .Select(log=>log.Details).ToArrayAsync();

                // Log the count of logs retrieved (for debugging purposes)
                Console.WriteLine($"Retrieved {logs} logs for MattressId {mattressId}.");

                return null;
            }
            catch (Exception ex)
            {
                // Log the exception
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

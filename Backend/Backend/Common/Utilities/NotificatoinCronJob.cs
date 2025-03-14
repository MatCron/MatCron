using Backend.Repositories;
using Backend.Repositories.Interfaces;

namespace Backend.Common.Utilities
{
    public class NotificatoinCronJob:BackgroundService
    {
        private readonly ILogger<NotificatoinCronJob> _logger;
        private readonly INotificationRepository _notificationRepository;

        public NotificatoinCronJob(ILogger<NotificatoinCronJob> logger, INotificationRepository notificationRepository)
        {
            _logger = logger;
            _notificationRepository = notificationRepository;
        }

        protected override async Task ExecuteAsync(INotificationRepository notificationR)
        {
            _logger.LogInformation("MyCronJob started at: {time}", DateTimeOffset.Now);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Your daily scheduled task logic
                    _logger.LogInformation("Daily cron job executed at: {time}", DateTimeOffset.Now);

                    // Simulate a task (e.g., database cleanup, API call)
                    await Task.Delay(2000, stoppingToken); // Simulating work for 2 seconds

                    // Calculate next execution time (same time next day)
                    DateTime now = DateTime.Now;
                    DateTime nextRun = now.Date.AddDays(1).AddHours(now.Hour).AddMinutes(now.Minute);
                    TimeSpan delay = nextRun - now;

                    _logger.LogInformation("Next run scheduled at: {nextRun}", nextRun);

                    await Task.Delay(delay, stoppingToken); // Wait until next day
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred in MyCronJob");
                }
            }

            _logger.LogInformation("MyCronJob stopped.");
        }
    }
}

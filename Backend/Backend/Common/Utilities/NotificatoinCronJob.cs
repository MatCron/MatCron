using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using Backend.Repositories.Interfaces;

namespace Backend.Common.Utilities
{
    public class NotificationCronJob : BackgroundService
    {
        private readonly ILogger<NotificationCronJob> _logger;
        private readonly INotificationRepository _notificationRepository;

        public NotificationCronJob(ILogger<NotificationCronJob> logger, INotificationRepository notificationRepository)
        {
            _logger = logger;
            _notificationRepository = notificationRepository;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("NotificationCronJob started at: {time}", DateTimeOffset.Now);

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Your daily scheduled task logic
                    bool result = await _notificationRepository.CheckRotationNotification();
                    _logger.LogInformation("CheckRotationNotification executed with result: {result}", result);
                    
                    

                    // Simulate a task (e.g., database cleanup, API call)
                    await Task.Delay(2000, stoppingToken); // Simulating work for 2 seconds

                    // Calculate next execution time (same time next day)
                    DateTime now = DateTime.Now;
                    DateTime nextRun = now.AddDays(1);
                    TimeSpan delay = nextRun - now;

                    _logger.LogInformation("Next run scheduled at: {nextRun}", nextRun);

                    await Task.Delay(delay, stoppingToken); // Wait until next day
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred in NotificationCronJob");
                }
            }

            _logger.LogInformation("NotificationCronJob stopped.");
        }
    }
}
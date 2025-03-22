using Backend.Repositories.Interfaces;

public class NotificationCronJob : IHostedService, IDisposable
{
    private readonly ILogger<NotificationCronJob> _logger;
    private readonly IServiceProvider _services;
    private Timer _timer;

    public NotificationCronJob(ILogger<NotificationCronJob> logger, IServiceProvider services)
    {
        _logger = logger;
        _services = services;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("NotificationCronJob started at: {time}", DateTimeOffset.Now);

        // Schedule the task to run daily
        _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromDays(1));

        return Task.CompletedTask;
    }

    private void DoWork(object state)
    {
        using (var scope = _services.CreateScope())
        {
            var notificationRepository = scope.ServiceProvider.GetRequiredService<INotificationRepository>();

            try
            {
                notificationRepository.CheckRoationCron().Wait();
                _logger.LogInformation("CheckRotationNotification executed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred in NotificationCronJob");
            }
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("NotificationCronJob stopped.");
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}
using Backend.DTOs.Notification;


namespace Backend.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<List<NotificationDTO>> GetAllGetAllNotificatoin();
        Task<bool> CheckNewNotification(String Id);
        
        Task<bool> DeleteNotificatoin(string NotificationId);
        

    }
}

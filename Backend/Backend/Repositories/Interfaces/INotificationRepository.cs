using Backend.DTOs.Notification;


namespace Backend.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<List<UserNotificationDTO>> GetAllGetAllNotificatoin(String UserId);
        Task<bool> CheckRotationNotification();
        
        Task<bool> DeleteNotificatoin(string NotificationId);
        

    }
}

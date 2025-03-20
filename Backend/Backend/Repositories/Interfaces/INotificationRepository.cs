
using Backend.DTOs.Notification;
using MatCron.Backend.Entities;



namespace Backend.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<List<UserNotificationDTO>> GetAllGetAllNotificatoin(Guid UserId);
        Task<bool> CheckRotationNotification();
        
        Task<bool> DeleteNotificatoin(string NotificationId);
        Task<int> CountUnreadMessages(Guid UserId);

        Task<UserNotificationDTO> GetUserNotificationById(Guid NotificationId);
        Task<bool> CreateNewOrgNotification(String Messaege, Guid? OrgId);
        Task<bool> CreateTransferOutNotificatoin(Group org);
        //Task<bool> CreateTranferOutNotificatoin();

    }
}

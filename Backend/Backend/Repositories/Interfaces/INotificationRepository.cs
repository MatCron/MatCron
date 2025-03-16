using System.Text.RegularExpressions;
using Backend.DTOs.Notification;


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
        Task<bool> CreateTranferOutNotificatoin(Group org);
        //Task<bool> CreateTranferOutNotificatoin();

    }
}

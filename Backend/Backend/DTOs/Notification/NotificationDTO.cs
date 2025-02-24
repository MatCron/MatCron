
namespace Backend.DTOs.Notification

{
    public class NotificationDTO

    {
        public string Id { get; set; }
        public string Message { get; set; }
        public string status { get; set; }

        public DateOnly CreatedAt { get; set; }
        public DateOnly UpdatedAt { get; set; }
    }

    public class DeleteNotificationDTO
    {
        public string Id { get; set; }
    }

    public class UserNotificationDTO {
        public string Id { get; set; }
        public string NotificationMessaage { get; set; }
        public byte NotificationStatus { get; set; }
        public DateOnly? ReadAt { get; set; }
        public byte ReadStatus { get; set; }

    }
}

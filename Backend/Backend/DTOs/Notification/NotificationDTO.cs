using Comm
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
}

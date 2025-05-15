using MatCron.Backend.Entities;

namespace Backend.Entities
{
    public class UserNotification
    {
        public Guid Id { get; set; }
        public DateOnly? ReadAt { get; set; }
        public byte ReadStatus { get; set; }
        public String? Message { get; set; }

        //Navigation Properties
        public User User { get; set; }
        public Notification Notification { get; set; }
    }
}

using MatCron.Backend.Entities;

namespace Backend.Entities
{
    public class UserNotification
    {
        public string Id { get; set; }
        public DateOnly ReadAt { get; set; }
        public int ReadStatus { get; set; }

        //Navigation Properties
        public User User { get; set; }
        public Notification Notification { get; set; }
    }
}

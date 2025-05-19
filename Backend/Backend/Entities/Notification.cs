using MatCron.Backend.Entities;

namespace Backend.Entities
{
    public class Notification
    {
        public Guid Id { get; set; }
        public string Message { get; set; }
        public byte Status { get; set; }
        public DateOnly CreatedAt { get; set; }
        public DateOnly UpdatedAt{ get; set; }
        public Guid? OrganisationId { get; set; }
        //navigation properties
        //public NotificationType NotificationType { get; set; }
        public Organisation Organisation { get; set; }
    }
}

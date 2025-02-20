namespace Backend.Entities
{
    public class Notification
    {
        public Guid Id { get; set; }
        public string Message { get; set; }
        public int Status { get; set; }
        public DateOnly CreatedAt { get; set; }
        public DateOnly UpdatedAt{ get; set; }
        //navigation properties
        public NotificationType NotificationType { get; set; }
    }
}

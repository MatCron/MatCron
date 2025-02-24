namespace Backend.Entities
{
    public class NotificationType
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Template { get; set; }
        // Navigation Properties
        //public ICollection<Notification> Notifications { get; set; } = new List<Notification>();

    }
}

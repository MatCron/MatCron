namespace MatCron.Backend.Entites
{
    public class RequestOrder
    {
        public int Id { get; set; } // Primary Key
        public int GroupId { get; set; } // Foreign Key to Group
        public int UserId { get; set; } // Foreign Key to User

        // Navigation Properties
        public Group Group { get; set; }
        public User User { get; set; }
    }
}

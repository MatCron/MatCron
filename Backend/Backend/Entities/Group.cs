namespace MatCron.Backend.Entities
{
    public class Group
    {
        public Guid Id { get; set; } // Primary Key
        public Guid OrgId { get; set; } // Foreign Key to Organisation
        public Guid UserId { get; set; } // Foreign Key to User
        public byte? Status { get; set; } // Nullable Status

        // Navigation Properties
        public Organisation? Organisation { get; set; } // Reference to Organisation
        // public ICollection<User> Users { get; set; } = new List<User>(); // Users in the Group
        public ICollection<Mattress>? Mattresses { get; set; } = new List<Mattress>(); // Related Mattresses
        public ICollection<MattressGroup>? MattressGroups { get; set; } = new List<MattressGroup>(); // Related Mattress Groups
    }
}
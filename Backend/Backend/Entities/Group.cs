

namespace MatCron.Backend.Entities
{
    public class Group
    {
        public int Id { get; set; } // Primary Key
        public int OrgId { get; set; } // Foreign Key to Organisation
        public int UserId { get; set; } // Foreign Key to User
        public string? ContactNumber { get; set; }
        public string? Status { get; set; }

        // Navigation Properties
        public Organisation? Organisation { get; set; }
        public User? User { get; set; }
        public ICollection<Mattress>? Mattresses { get; set; }
        public ICollection<MattressGroup>? MattressGroups { get; set; }

    }
}

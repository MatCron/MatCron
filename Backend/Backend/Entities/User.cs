namespace MatCron.Backend.Entities
{
    public class User
    {
        public int Id { get; set; } // Primary Key
        public int OrgId { get; set; } // Foreign Key to Organisation
        public string? Password { get; set; }
        public string? Token { get; set; }
        public string? Email { get; set; }
        public bool EmailVerified { get; set; }
        public string? UserType { get; set; }

        // Navigation Properties
        public Organisation? Organisation { get; set; }
        public ICollection<Group>? Groups { get; set; }
    }
}

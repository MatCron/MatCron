using System.Text.Json.Serialization;

namespace MatCron.Backend.Entities
{
    public class User
    {
        public int Id { get; set; } // Primary Key
        public int OrgId { get; set; } // Foreign Key to Organisation
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string? Email { get; set; }
        public byte EmailVerified { get; set; }
        public byte UserType { get; set; }
        public string? ProfilePicture { get; set; }

        
        [JsonIgnore]
        // Navigation Property
        public Organisation Organisation { get; set; } // User belongs to Organisation
    }
}
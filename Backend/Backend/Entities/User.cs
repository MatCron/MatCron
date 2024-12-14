using System;

namespace MatCron.Backend.Entities
{
    public class User
    {
        public Guid Id { get; set; } // GUID Primary Key
        public Guid OrgId { get; set; } // Foreign Key to Organisation
        public string FirstName { get; set; } // User's first name
        public string LastName { get; set; } // User's last name
        public string Password { get; set; } // Hashed password
        public string Email { get; set; } // User's email address
        public string? Token { get; set; }
        public byte EmailVerified { get; set; } // Email verification status
        public byte? UserType { get; set; } // Type of user (optional)
        public string? ProfilePicture { get; set; } // Profile picture (optional)

        // Navigation Property
        public Organisation Organisation { get; set; } // User belongs to Organisation
    }
}
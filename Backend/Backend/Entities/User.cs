using System;
using Backend.Common.Enums;

namespace MatCron.Backend.Entities
{
    public class User
    {
        public Guid Id { get; set; }  // Primary Key
        public Guid? OrgId { get; set; }  // Foreign Key to Organisation
        public string? FirstName { get; set; }  
        public string? LastName { get; set; }  
        public string? Password { get; set; }  
        public string? Email { get; set; }  
        public byte EmailVerified { get; set; }  
        public byte UserRole { get; set; } 
        public byte Status { get; set; }
        public string? ProfilePicture { get; set; }  
        public string? Token { get; set; }  

        // Navigation Properties
        public Organisation Organisation { get; set; }  // Many-to-One with Organisation
        public UserVerification? UserVerification { get; set; }
        
    }
}
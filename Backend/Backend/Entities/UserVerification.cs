using System;
using MatCron.Backend.Entities;

namespace MatCron.Backend.Entities
{

    public class UserVerification
    {
        public Guid UserId { get; set; }
        public byte EmailConfirmed { get; set; }
        public string? EmailVerificationToken { get; set; }
        public DateTime? TokenExpiration { get; set; }

        // Navigation back to the User
        public User User { get; set; }
    }
}
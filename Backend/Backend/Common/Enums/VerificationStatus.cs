namespace Backend.Common.Enums
{
    public enum VerificationStatus
    {
        Pending = 0,    // Verification is pending
        Active = 1,     // Verification is active/completed
        Expired = 2,    // Verification token has expired
        Invalid = 3     // Verification token is invalid
    }
} 
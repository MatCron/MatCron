namespace Backend.Common.Enums
{
    public enum EmailStatus
    {
        Pending = 0,        // Email is pending to be sent
        Sent = 1,           // Email has been successfully sent
        Failed = 2,         // Email sending failed
        Verified = 3        // Email address is verified
    }
}
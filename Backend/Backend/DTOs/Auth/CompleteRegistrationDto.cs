namespace Backend.DTOs.Auth
{
    public class CompleteRegistrationDto
    {
        public string Token { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Password { get; set; }
        public string? ProfilePicture { get; set; }
    }
} 
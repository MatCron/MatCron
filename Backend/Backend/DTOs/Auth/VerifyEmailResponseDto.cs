namespace Backend.DTOs.Auth
{
    public class VerifyEmailResponseDto
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
        public string Email { get; set; }
    }
    
    
} 
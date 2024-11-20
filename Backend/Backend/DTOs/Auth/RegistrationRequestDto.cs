using Backend.Common.Enums;

namespace MatCron.Backend.DTOs
{
    public class RegistrationRequestDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int OrgId { get; set; }
        public UserTypeEnum UserType { get; set; }
    }
}
using Backend.Common.Enums;

namespace MatCron.Backend.DTOs
{
    public class RegistrationRequestDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string OrganisationCode { get; set; } // New field for OrganisationCode
        public UserTypeEnum UserType { get; set; }
    }
}
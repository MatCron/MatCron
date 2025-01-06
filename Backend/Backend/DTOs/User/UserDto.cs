using Backend.DTOs.Organisation;
using MatCron.Backend.Entities;

namespace Backend.DTOs.User
{
    public class UserDto
    {
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? UserType { get; set; }
        public OrganisationSummariseResponseDto? organisation { get; set; }
    }
}

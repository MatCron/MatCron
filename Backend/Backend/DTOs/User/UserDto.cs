using Backend.Common.Enums;
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
        public byte UserRole { get; set; } 
        public OrganisationSummariseResponseDto? organisation { get; set; }
    }
}

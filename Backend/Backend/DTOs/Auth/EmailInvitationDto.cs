using Backend.Common.Enums;
using System;

namespace Backend.DTOs.Auth
{
    public class EmailInvitationDto
    {
        public string Email { get; set; }
        public byte UserRole { get; set; }
        public Guid OrgId { get; set; } // Organization ID to assign to the user
    }
} 
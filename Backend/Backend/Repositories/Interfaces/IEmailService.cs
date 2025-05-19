using Backend.Common.Enums;
using Backend.DTOs.Auth;
using System;
using System.Threading.Tasks;

namespace Backend.Repositories.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendInvitationEmailAsync(EmailInvitationDto emailDto);
        
    }
} 
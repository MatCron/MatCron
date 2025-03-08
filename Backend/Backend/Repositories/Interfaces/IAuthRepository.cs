using Backend.DTOs;
using Backend.DTOs.Auth;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using Microsoft.AspNetCore.Mvc;

namespace MatCron.Backend.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<IActionResult> RegisterUserAsync(RegistrationRequestDto dto);

        Task<IActionResult> LoginUserAsync(LoginRequestDto dto);
        Task<VerifyEmailResponseDto> VerifyEmailTokenAsync(string token);
        Task<IActionResult> CompleteRegistrationAsync(CompleteRegistrationDto registrationDto);
        
        Task<(User user, string token)> CreateUserAndVerificationAsync(EmailInvitationDto emailDto);
 
     

    }
}
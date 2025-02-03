using Backend.DTOs;
using Backend.DTOs.Auth;
using MatCron.Backend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace MatCron.Backend.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<IActionResult> RegisterUserAsync(RegistrationRequestDto dto);

        Task<IActionResult> LoginUserAsync(LoginRequestDto dto);
    }
}
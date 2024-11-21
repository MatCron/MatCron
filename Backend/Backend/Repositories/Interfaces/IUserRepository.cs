using MatCron.Backend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace MatCron.Backend.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<IActionResult> RegisterUserAsync(RegistrationRequestDto dto);
    }
}
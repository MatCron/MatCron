using Backend.DTOs.Auth;
using MatCron.Backend.DTOs;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MatCron.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public AuthController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationRequestDto dto)
        {
            var message = await _userRepository.RegisterUserAsync(dto);
            return Ok(new { success = true, message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            var token = await _userRepository.LoginUserAsync(dto);
            if (token == null) return Unauthorized(new { success = false, message = "Invalid credentials" });

            return Ok(new { success = true, token });
        }
    }
}
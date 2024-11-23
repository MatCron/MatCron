using Backend.DTOs;
using Backend.DTOs.Auth;
using MatCron.Backend.DTOs;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
            RepositoryResponse result = await _userRepository.LoginUserAsync(dto);
            if (result._error != null) return Unauthorized(new { success = false, message = result._error });
            
            return Ok(new {data = result._data});
        }
    }
}
using Backend.Common.Utilities;
using Backend.DTOs;
using Backend.DTOs.Auth;
using MatCron.Backend.DTOs;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace MatCron.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;

        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationRequestDto dto)
        {
            try
            {
                var result = await _authRepository.RegisterUserAsync(dto);

                // Check if the result is OkObjectResult
                if (result is OkObjectResult okResult)
                {
                    return Ok(okResult.Value); // Return success with the value
                }
                else
                {
                    // For any other ObjectResult type (e.g., BadRequest, Conflict, etc.)
                    return result;
                }
            }
            catch (Exception ex)
            {
                // Handle unexpected exceptions
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            try
            {
                var result = await _authRepository.LoginUserAsync(dto);
                return result;
            } catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
            
        }

    }
}
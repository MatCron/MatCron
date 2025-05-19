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
        
        
        // This endpoint is created so that the Email Confirmation Id is checked when the link on the Email is clicked 
        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmailToken([FromQuery] string token)
        {
            var result = await _authRepository.VerifyEmailTokenAsync(token);
            // result is a VerifyEmailResponseDto, so check `IsValid`
            if (result.IsValid)
                return Ok(new { success = true, message = result.Message, email = result.Email });
            else
                return BadRequest(new { success = false, message = result.Message, email = result.Email });
        }
        
        
        // This will polulate the rest of the columns in a user table to complete the registration 
        [HttpPost("complete-registration")]
        public async Task<IActionResult> CompleteRegistration([FromBody] CompleteRegistrationDto dto)
        {
            return await _authRepository.CompleteRegistrationAsync(dto);
        }


    }
}
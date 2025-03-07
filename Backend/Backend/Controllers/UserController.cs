using Backend.DTOs.User;
using Backend.Repositories.Interfaces;
using MatCron.Backend.Entities;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public UsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UserDto user)
        {
            try
            {
                user.Id = id;
                var result = await _userRepository.UpdateUserAsync(user);
                return Ok(new { success = true, message = $"successfully update {id}" , result = result });
                
            } catch (Exception e)
            {
                return StatusCode(500, new { success = false, error=e});
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            try
            {
                 bool result = await _userRepository.DeleteUser(id);
                return Ok(new { success = result, message = $"successfully delete {id}" });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, error = e });
            }
        }
        
      

        [HttpGet("organization/{orgId}")]
        public async Task<IActionResult> DisplayAllUsers(string orgId)
        {
            try
            {
                var users = await _userRepository.GetUsersByOrganisationIdAsync(orgId);
                return Ok(new { success = true, users });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { success = false, error = e.Message });
            }
        }


    }
}

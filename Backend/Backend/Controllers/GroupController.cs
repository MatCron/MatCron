using Backend.Repositories.Interfaces;
using MatCron.Backend.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace MatCron.Backend.Controllers
{
    [ApiController]
    [Route("api/groups")]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupRepository _groupRepository;

        public GroupsController(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }

        // Creating a New group for a Organisation 
        [HttpPost("add")]
        public async Task<IActionResult> CreateGroup([FromBody] GroupCreateDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var groupDto = await _groupRepository.CreateGroupAsync(dto);
                return Ok(groupDto);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = "An error occurred while creating the group.",
                    Error = ex.Message
                });
            }
        }



        // Adding Multiple Mattresses along with the Group Id  to be assigining the mattresses to the following group        
        [HttpPost("mattresses/multiple")]
        public async Task<IActionResult> AddMattressesToGroup([FromBody] EditMattressesToGroupDto dto)
        {
            try
            {
                // Call the repository to handle the logic
                await _groupRepository.AddMattressesToGroupAsync(dto);

                return Ok(new { Message = "Mattresses added successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = "An error occurred while adding mattresses to the group.",
                    Error = ex.Message
                });
            }
        }
    }

}
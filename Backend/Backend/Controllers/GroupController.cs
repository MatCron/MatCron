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
                var group = await _groupRepository.CreateGroupAsync(dto);
                return Ok(new { Message = "Group created successfully.", Group = group });
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
        
        //API to display all the groups based on the Status ( Active or Archieved ) 
        [HttpPost("status")]
        public async Task<IActionResult> GetGroupsByStatus([FromBody] GroupRequestDto requestDto)
        {
            try
            {
                // Validate input
                if (requestDto == null)
                {
                    return BadRequest("Request data is missing.");
                }

                // Fetch groups based on status
                var groups = await _groupRepository.GetGroupsByStatusAsync(requestDto);

                if (groups == null || !groups.Any())
                {
                    return NotFound("No groups found for the specified criteria.");
                }

                return Ok(groups);
            }
            catch (Exception ex)
            {
                // Log error if needed
                Console.WriteLine($"Error: {ex.Message}");

                return StatusCode(500, new
                {
                    Message = "An error occurred while processing the request.",
                    Details = ex.Message
                });
            }
        }

        
        
        
        [HttpGet("{groupId}")]
        public async Task<IActionResult> GetMattressesByGroupId(Guid groupId)
        {
            try
            {
                var mattresses = await _groupRepository.GetMattressesByGroupIdAsync(groupId);

                if (!mattresses.Any())
                {
                    return NotFound(new { Message = "No mattresses found for the specified group." });
                }

                return Ok(mattresses);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while retrieving mattresses for the group.",
                    Error = ex.Message
                });
            }
        }
        
        
        [HttpPost("mattresses/remove")]
        public async Task<IActionResult> RemoveMattressesFromGroup([FromBody] EditMattressesToGroupDto dto)
        {
            try
            {
                await _groupRepository.RemoveMattressesFromGroupAsync(dto);
                return Ok(new { Message = "Mattresses removed successfully from the group." });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = "An error occurred while removing mattresses from the group.",
                    Error = ex.Message
                });
            }
        }
        
        

        




      



    }
}
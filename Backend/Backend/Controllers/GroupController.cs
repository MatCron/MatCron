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
        private readonly INotificationRepository _notifcationRepository;

        public GroupsController(IGroupRepository groupRepository, INotificationRepository notifcationRepository )
        {
            _groupRepository = groupRepository;
            _notifcationRepository = notifcationRepository;
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
        //Can we used for  displaying all the Groups as a dropdown in Mattress Page 
        
        [HttpPost("group-by-status")]
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
        public async Task<IActionResult> GetGroupById(Guid groupId)
        {
            try
            {
                var groupData = await _groupRepository.GetGroupByIdAsync(groupId);

                if (groupData == null)
                {
                    return NotFound(new { Message = "Group not found." });
                }

                return Ok(groupData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while retrieving group details.",
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
        [HttpPost("transfer-out/{groupId}")]
        public async Task<IActionResult> TransferOut(Guid groupId)
        {
            try
            {
                await _groupRepository.TransferOutGroupAsync(groupId);
                await _notifcationRepository.CreateTransferOutNotificatoin(groupId);
                return Ok(new { Message = "Group transferred out successfully. All mattresses updated to InTransit status." });
                
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = "An error occurred while transferring out the group.",
                    Error = ex.Message
                });
            }
        }
        
        [HttpGet("import-preview/{mattressId}")]
        public async Task<IActionResult> ImportPreview(Guid mattressId)
        {
            try
            {
                var groupDetails = await _groupRepository.ImportPreview(mattressId);
                return Ok(groupDetails);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = "An error occurred while fetching the active group details.",
                    Error = ex.Message
                });
            }
        }
        
        
        [HttpPost("import-mattresses/{groupId}")]
        public async Task<IActionResult> ImportMattressesFromGroup(Guid groupId)
        {
            try
            {
                await _groupRepository.ImportMattressesFromGroupAsync(groupId);
                return Ok(new { Message = "Mattresses imported successfully, and group status updated to Archived." });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = "An error occurred while importing mattresses from the group.",
                    Error = ex.Message
                });
            }
        }
        
    }
}
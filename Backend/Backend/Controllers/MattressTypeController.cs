using MatCron.Backend.DTOs;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MatCron.Backend.Controllers
{
    [ApiController]
    [Route("api/mattresstype")]
    public class MattressTypeController : ControllerBase
    {
        private readonly IMattressTypeRepository _mattressTypeRepository;

        public MattressTypeController(IMattressTypeRepository mattressTypeRepository)
        {
            _mattressTypeRepository = mattressTypeRepository;
        }

        // Fetch all mattress types
        [HttpGet("display-all-types")]
        public async Task<IActionResult> DisplayAllTypes()
        {
            try
            {
                var mattressTypes = await _mattressTypeRepository.GetAllMattressTypesAsync();
                if (mattressTypes == null || !mattressTypes.Any())
                {
                    return Ok(new { success = true, data = new List<object>(), message = "No mattress types found." });
                }
                return Ok(new { success = true, data = mattressTypes });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // Fetch summaries of mattress types
        [HttpGet("summaries")]
        public async Task<IActionResult> GetMattressTypeSummaries()
        {
            try
            {
                var summaries = await _mattressTypeRepository.GetMattressTypeSummariesAsync();
                if (summaries == null || !summaries.Any())
                {
                    return Ok(new { success = true, data = new List<object>(), message = "No mattress type summaries found." });
                }
                return Ok(new { success = true, data = summaries });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // Fetch a mattress type by ID using MattressTypeRequestDto
        [HttpPost("id")]
        public async Task<IActionResult> GetMattressTypeById([FromBody] MattressTypeRequestDto requestDto)
        {
            try
            {
                if (requestDto == null || requestDto.Id == Guid.Empty)
                {
                    return BadRequest(new { success = false, message = "Invalid ID provided." });
                }

                var mattressType = await _mattressTypeRepository.GetMattressTypeByIdAsync(requestDto.Id);

                if (mattressType == null)
                {
                    return NotFound(new { success = false, message = "Mattress type not found." });
                }

                return Ok(new { success = true, data = mattressType });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
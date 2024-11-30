using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MatCron.Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MattressTypeController : ControllerBase
    {
        private readonly IMattressTypeRepository _mattressTypeRepository;

        public MattressTypeController(IMattressTypeRepository mattressTypeRepository)
        {
            _mattressTypeRepository = mattressTypeRepository;
        }

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
    }
}
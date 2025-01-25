using Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend.Controllers
{
    [Route("api/mattress/{mattressId}/[controller]")]
    [ApiController]
    public class LogController : ControllerBase
    {
        private readonly ILogRepository _logRepository;
        public LogController(ILogRepository log) 
        {
            _logRepository = log;
        }
        // GET: api/<LogController>
        [HttpGet]
        public async Task<IActionResult> Get(string mattressId)
        {
            try
            {
                var result = await _logRepository.GetAllLogsOfMattress(mattressId);
                return Ok(result);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        
    }
}

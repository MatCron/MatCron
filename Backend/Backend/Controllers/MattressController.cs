using Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MattressController : ControllerBase
    {
        private readonly IMattressRepository _mattressRepository;

        public MattressController(IMattressRepository mattressRepository)
        {
            _mattressRepository = mattressRepository;
        }
        // GET: api/<MattressController>
        [HttpGet]
        public IActionResult DiaplayAllMatresses()
        {
            try
            {
                var mattresses = await _mattressRepository.GetAllMattressesAsync();
                if (mattresses == null || !mattresses.Any())
                {
                    return Ok(new { success = true, data = new List<object>(), message = "No mattresses found." });
                }
                return Ok(new { success = true, data = mattresses });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }

        // GET api/<MattressController>/5
        [HttpGet("{id}")]
        public string GetMattressById(int id)
        {
            return "value";
        }

        // POST api/<MattressController>
        [HttpPost]
        public void CreateMatress([FromBody] string value)
        {
        }

        // PUT api/<MattressController>/5
        [HttpPut("{id}")]
        public void EditMatress(int id, [FromBody] string value)
        {
        }

        // DELETE api/<MattressController>/5
        [HttpDelete("{id}")]
        public void DeleteMattress(int id)
        {
        }
    }
}

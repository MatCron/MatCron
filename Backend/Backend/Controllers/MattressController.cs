using Backend.DTOs.Mattress;
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
        public async Task<IActionResult> DiaplayAllMatresses()
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
        }

        // GET api/<MattressController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMattressById(string id)
        {
                try
                {
                    var mattress = await _mattressRepository.GetMattressByIdAsync(id);
                    if (mattress == null)
                    {
                        return Ok(new { success = true, data = new List<object>(), message = "No mattress found." });
                    }
                    return Ok(new { success = true, data = mattress });

                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
                }
        }

        // POST api/<MattressController>
        [HttpPost]
        public async Task<IActionResult> CreateMatress([FromBody] MattressDto dto)
        {
            try
            {
                var mattress = await _mattressRepository.AddMattressAsync(dto);
                if (mattress == null)
                {
                    return Ok(new { success = true, data = new List<object>(), message = "No mattress found." });
                }
                return Ok(new { success = true, data = mattress });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // PUT api/<MattressController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> EditMatress(string id, [FromBody] MattressDto dto)
        {
            try
            {
                var mattress = await _mattressRepository.EditMattressAsync(id, dto);
                if (mattress == null)
                {
                    return Ok(new { success = true, data = new List<object>(), message = "No mattress found." });
                }
                return Ok(new { success = true, data = mattress });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in EditMatress: {ex.Message}");
                throw;

            }
        }

        // DELETE api/<MattressController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMattress(string id)
        {
            try
            {
                bool result = await _mattressRepository.DeleteMattressAsync(id);
                if (result)
                {
                    return Ok(new { success = true, message = "Mattress deleted successfully." });

                }
                else
                {
                    return Ok(new { success = true, message = "No mattress found." });

                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}

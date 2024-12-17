using Backend.DTOs.Organisation;
using Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganisationController : ControllerBase
    {
        private readonly IOrganisationRepository _organisationRepository;
        public OrganisationController(IOrganisationRepository organisationRepository)
        {
            _organisationRepository = organisationRepository;
        }
        // GET: api/<OrganisationController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var result = await _organisationRepository.GetAll();
                return Ok(new {data = result});
            } catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // GET api/<OrganisationController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            try
            {
                var result = await _organisationRepository.GetById(id);
                return Ok(new { data = result });
            } catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // POST api/<OrganisationController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OrganisationDTO dto)
        {
            try
            {
                var result = await _organisationRepository.Create(dto);
                return Created($"/api/organisation/{result.Id}",new  { data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });

            }
        }

        // PUT api/<OrganisationController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] OrganisationDTO dto)
        {
            try
            {
                dto.Id = id;
                var result = await _organisationRepository.Update(dto);
                return Ok(new { data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        
        // DELETE api/<OrganisationController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                bool result = await _organisationRepository.Delete(id);
                if (result)
                {
                    return Ok(new {success = true, message= $"Organisation id({id}) deleted successfully." });
                }
                else
                {
                    return StatusCode(500, new { success = false, message = $"An error occurred: Unable to delete organisation id({id})" });
                }
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}

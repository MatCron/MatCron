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
        public async Task<IActionResult> DisplayAllOrganisations()
        {
            try
            {
                var result = await _organisationRepository.GetAllOrganisations();
                return Ok(new {data = result});
            } catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // GET api/<OrganisationController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> DisplayOrganisation(string id)
        {
            try
            {
                var result = await _organisationRepository.GetOrganisationById(id);
                return Ok(new { data = result });
            } catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // POST api/<OrganisationController>
        [HttpPost]
        public async Task<IActionResult> PostOrganisation([FromBody] OrganisationDTO dto)
        {
            try
            {
                var result = await _organisationRepository.CreateOrganisation(dto);
                return Created($"/api/organisation/{result.Id}",new  { data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });

            }
        }

        // PUT api/<OrganisationController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrganistion(string id, [FromBody] OrganisationDTO dto)
        {
            try
            {
                dto.Id = id;
                var result = await _organisationRepository.UpdateOrganisation(dto);
                return Ok(new { data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        
        // DELETE api/<OrganisationController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrganisation(string id)
        {
            try
            {
                bool result = await _organisationRepository.UpdateOrganisation(id);
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

        [HttpGet("Code")]
        public async Task<IActionResult> GetOrganisationByCode(string code)
        {
            try
            {
                var result = await _organisationRepository.GetOrganisationByCode(code);
                return Ok(new { data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}

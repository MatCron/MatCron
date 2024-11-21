using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TestController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("test-connection")]
        public IActionResult TestConnection()
        {
            try
            {
                var users = _context.Users
                    .Select(u => new { u.Id, u.FirstName, u.LastName, u.Email, u.Password })
                    .ToList();
                return Ok(new { success = true, data = users });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {
            try
            {
                var users = _context.Users
                    .Include(u => u.Organisation)
                    .ToList();
                return Ok(new { success = true, data = users });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("organisations")]
        public IActionResult GetOrganisations()
        {
            try
            {
                // Fetch only organisation details
                var organisations = _context.Organisations
                    .Select(o => new
                    {
                        o.Id,
                        o.Name,
                        o.Email,
                        o.Description,
                        o.PostalAddress,
                        o.NormalAddress,
                        o.WebsiteLink,
                        o.Logo,
                        o.RegistrationNo,
                        o.OrganisationType,
                        o.OrganisationCode
                    })
                    .ToList();

                return Ok(new { success = true, data = organisations });
            }
            catch (Exception ex)
            {
                // Return 500 status code if an exception occurs
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetTeaPot")]
        public IActionResult GetTeaPot()
        {
            return StatusCode(418, new { success = false, message = "I'm a teapot" });
        }
    }
}
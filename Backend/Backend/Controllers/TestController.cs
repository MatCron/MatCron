
using Backend.Common.Utilities;
using Backend.DTOs;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtUtils _jwtUtils;
        public TestController(ApplicationDbContext context,JwtUtils jwtUtils)
        {
            _context = context;
            _jwtUtils = jwtUtils;
        }

        // 1. Test Database Connection
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

        // 2. Get All Users with Organisations
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

        // 3. Get All Organisations
        [HttpGet("organisations")]
        public IActionResult GetOrganisations()
        {
            try
            {
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
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // 4. Get Mattress Types
        [HttpGet("mattress-types")]
        public IActionResult GetMattressTypes()
        {
            try
            {
                var mattressTypes = _context.MattressTypes.AsNoTracking().ToList();
                if (!mattressTypes.Any())
                {
                    return Ok(new { success = true, data = new List<object>(), message = "No mattress types found." });
                }
                return Ok(new { success = true, data = mattressTypes });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message, stackTrace = ex.StackTrace });
            }
        }
        
        
        [HttpGet("GetTeaPot")]
        public IActionResult GetTeaPot()
        {
            return StatusCode(418, new { success = false, message = "I'm a teapot" });
        }

        
        // 5. Get Mattresses with Related Entities
        [HttpGet("mattresses")]
        public IActionResult GetMattresses()
        {
            try
            {
                var mattresses = _context.Mattresses
                    .Include(m => m.MattressType)
                    .Include(m => m.Organisation)
                    .Include(m => m.Location)
                    .Select(m => new
                    {
                        m.Uid,
                        m.BatchNo,
                        m.Status,
                        m.ProductionDate,
                        MattressType = m.MattressType.Name,
                        Organisation = m.Organisation.Name,
                        m.Location
                    })
                    .ToList();

                return Ok(new { success = true, data = mattresses });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        
        // 6. Get Mattress Logs
        [HttpGet("mattress-logs")]
        public IActionResult GetMattressLogs()
        {
            try
            {
                var logs = _context.LogMattresses
                    .Include(l => l.Mattress)
                    .Select(l => new
                    {
                        l.Id,
                        l.Status,
                        l.Details,
                        l.Type,
                        l.TimeStamp,
                        Mattress = l.Mattress.Uid
                    })
                    .ToList();

                return Ok(new { success = true, data = logs });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        
        // 7. Get Groups with Organisations
        // [HttpGet("groups")]
        // public IActionResult GetGroups()
        // {
        //     try
        //     {
        //         var groups = _context.Groups
        //             .Include(g => g.ReceiverOrganisation)
        //             .Select(g => new
        //             {
        //                 g.Id,
        //                 // g.ContactNumber,
        //                 g.Status,
        //                 OrganisationName = g.ReceiverOrganisation.Name
        //             })
        //             .ToList();
        //
        //         return Ok(new { success = true, data = groups });
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, new { success = false, message = ex.Message });
        //     }
        // }

        
        // 8. Get Mattress Groups (Many-to-Many)
        [HttpGet("mattress-groups")]
        public IActionResult GetMattressGroups()
        {
            try
            {
                var mattressGroups = _context.MattressGroups
                    .Include(mg => mg.Mattress)
                    .Include(mg => mg.Group)
                    .Select(mg => new
                    {
                        MattressId = mg.Mattress.Uid,
                        GroupId = mg.Group.Id,
                        GroupStatus = mg.Group.Status
                    })
                    .ToList();

                return Ok(new { success = true, data = mattressGroups });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        
        // 9. Get Locations
        [HttpGet("locations")]
        public IActionResult GetLocations()
        {
            try
            {
                var locations = _context.LocationMattresses
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Description
                    })
                    .ToList();

                return Ok(new { success = true, data = locations });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("test-token")]
        public async Task<IActionResult> GetToken([FromBody] TokenTest dto)
        {
            try
            {
                User user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
                if (user.Token == null)
                {
                    user.Token = _jwtUtils.GenerateJwtToken(user);
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();
                    return Ok(new { success = true, message = "Token generated", data = new { token = user.Token } });
                }
                else
                {
                    var (principals, error) = _jwtUtils.ValidateToken(user.Token);
                    if (principals != null)
                    {
                        return Ok(new { success = true, message = "Token validated", data = new { token = user.Token } });
                    }
                    else
                    {
                        user.Token = _jwtUtils.GenerateJwtToken(user);
                        _context.Users.Update(user);
                        await _context.SaveChangesAsync();
                        return Ok(new { success = true, message = "Token refreshed", data = new { token = user.Token } });
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        
    }
}
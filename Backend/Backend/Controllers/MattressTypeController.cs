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

        // Placeholder for future APIs
    }
}
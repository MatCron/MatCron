using Backend.Repositories.Interfaces;
using MatCron.Backend.DTOs;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MatCron.Backend.Controllers
{
    [ApiController]
    [Route("api/group")]
    public class GroupController : ControllerBase
    {
        private readonly IGroupRepository _groupRepository;

        public GroupController(IGroupRepository groupRepository)
        {
            _groupRepository = groupRepository;
        }


    }
}
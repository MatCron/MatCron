using Backend.Repositories;
using Backend.Repositories.Interfaces;
using MatCron.Backend.DTOs;
using MatCron.Backend.Repositories.Implementations;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MatCron.Backend.Controllers
{
    [ApiController]
    [Route("api/notification")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationController(INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        [HttpGet("all/{id}")]
        public async Task<IActionResult> DisplayAllNotification(String id)
        {
            try
            {
                var notificatoins = await _notificationRepository.GetAllGetAllNotificatoin(Guid.Parse(id));
                if (notificatoins == null || !notificatoins.Any())
                {
                    return Ok(new { success = true, data = new List<object>(), message = "No Notifications found." });
                }
                return Ok(new { success = true, data = notificatoins });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpGet("check")]
        public async Task<IActionResult> CheckNotification()
        {
            try
            {
                var group = await _notificationRepository.CheckRotationNotification();
                return Ok(new { Message = "notificationc checked successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Message = "An error occurred while checking notification.",
                    Error = ex.Message
                });
            }
        }

        [HttpGet("count-{id}")]
        public async Task<IActionResult> GetNotificationCount(String id )
        {
            try
            {
                var count = await _notificationRepository.CountUnreadMessages(Guid.Parse(id));
                return Ok(new { success = true, data = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpGet("getNotification/{id}")]
        public async Task<IActionResult> GetNotification(String id)
        {
            try
            {
                var notification = await _notificationRepository.GetUserNotificationById(Guid.Parse(id));
                return Ok(new { success = true, data = notification });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpGet("group")]
        public async Task<IActionResult> CreateNotificatoin()
        {
            try
            {
                var notification = await _notificationRepository.CreateTranferOutNotificatoin();
                return Ok(new { success = true, data = notification });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}

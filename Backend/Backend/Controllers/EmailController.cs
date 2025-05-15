

using Backend.DTOs.Auth;
using Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public EmailController(IEmailService emailService, IConfiguration configuration)
        {
            _emailService = emailService;
            _configuration = configuration;
        }

        [HttpPost("invite")]
        [AllowAnonymous]
        public async Task<IActionResult> SendInvitationEmail([FromBody] EmailInvitationDto emailDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _emailService.SendInvitationEmailAsync(emailDto);
            if (result)
                return Ok(new { Success = true, Message = "Invitation email sent." });
            else
                return BadRequest(new { Success = false, Message = "Failed to send invitation email or user already exists." });
        }



        // Test SendGrid config
        [HttpGet("test-sendgrid")]
        [AllowAnonymous]
        public async Task<IActionResult> TestSendGrid()
        {
            try
            {
                var apiKey = _configuration["SendGrid:ApiKey"];
                var fromEmail = _configuration["SendGrid:FromEmail"];
                var fromName = _configuration["SendGrid:FromName"];
                
                if (string.IsNullOrEmpty(apiKey))
                {
                    return BadRequest(new { Success = false, Message = "SendGrid API key is missing in configuration" });
                }
                
                if (string.IsNullOrEmpty(fromEmail))
                {
                    return BadRequest(new { Success = false, Message = "SendGrid FromEmail is missing in configuration" });
                }
                
                var client = new SendGridClient(apiKey);
                var from = new EmailAddress(fromEmail, fromName ?? "Test");
                var to = new EmailAddress(fromEmail); // Send to yourself for testing
                var subject = "SendGrid Test Email";
                var plainTextContent = "This is a test email from MatCron.";
                var htmlContent = "<strong>This is a test email from MatCron.</strong>";
                
                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = await client.SendEmailAsync(msg);
                
                var statusCode = response.StatusCode;
                var responseBody = await response.Body.ReadAsStringAsync();
                
                return Ok(new 
                { 
                    Success = statusCode == System.Net.HttpStatusCode.Accepted || statusCode == System.Net.HttpStatusCode.OK,
                    StatusCode = statusCode,
                    ResponseBody = responseBody,
                    Message = "SendGrid test completed"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Success = false, Message = $"SendGrid test failed: {ex.Message}" });
            }
        }

    }
}

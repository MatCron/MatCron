

using Backend.DTOs.Auth;
using Backend.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Threading.Tasks;
using MatCron.Backend.Repositories.Interfaces;

namespace Backend.Repositories
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ISendGridClient _sendGridClient;
        private readonly IAuthRepository _authRepository;

        public EmailService(IConfiguration configuration, IAuthRepository authRepository)
        {
            _configuration = configuration;
            _authRepository = authRepository;

            // Read the SendGrid API key from config
            var apiKey = _configuration["SendGrid:ApiKey"];
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new ArgumentException("SendGrid API key is missing in configuration");
            }

            _sendGridClient = new SendGridClient(apiKey);
            Console.WriteLine($"[Debug] SendGrid API Key Found. (Length = {apiKey.Length})");
        }

        public async Task<bool> SendInvitationEmailAsync(EmailInvitationDto emailDto)
        {
            try
            {
                // Step 1: Create user and verification record via AuthRepository
                var (user, token) = await _authRepository.CreateUserAndVerificationAsync(emailDto);

                // Step 2: Send email
                return await SendEmailAsync(emailDto.Email, emailDto.UserRole, token);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SendInvitationEmailAsync Exception: {ex.Message}");
                return false;
            }
        }

        private async Task<bool> SendEmailAsync(string email, byte userRole, string token)
        {
            var fromEmail = _configuration["SendGrid:FromEmail"];
            var fromName = _configuration["SendGrid:FromName"] ?? "MatCron Team";
            if (string.IsNullOrEmpty(fromEmail))
            {
                Console.WriteLine("SendGrid FromEmail missing in config.");
                return false;
            }

            var from = new EmailAddress(fromEmail, fromName);
            var to = new EmailAddress(email);
            var subject = "Welcome to MatCron - Complete Your Registration";

            var appUrl = _configuration["AppUrl"];
            var verificationLink = $"{appUrl}/verify-email?token={token}";

            var htmlContent = $@"
            <html>
            <body>
                <h1>Welcome to MatCron!</h1>
                <p>You have been invited to join MatCron as a {userRole}.</p>
                <p>Please click the link below to complete your registration (valid for 7 days):</p>
                <p><a href='{verificationLink}'>Complete Registration</a></p>
                <br>
                <p>Thank you,<br>The MatCron Team</p>
            </body>
            </html>";

            var msg = MailHelper.CreateSingleEmail(
                from,
                to,
                subject,
                "Welcome to MatCron! Please check your email client for the HTML message.",
                htmlContent
            );

            var response = await _sendGridClient.SendEmailAsync(msg);
            Console.WriteLine($"SendGrid status code: {response.StatusCode}");

            return (response.StatusCode == System.Net.HttpStatusCode.Accepted || response.StatusCode == System.Net.HttpStatusCode.OK);
        }
    }
}


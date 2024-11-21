using Backend.Common.Utilities;
using Backend.Data;
using Backend.DTOs.Auth;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace MatCron.Backend.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        public UserRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        // This is a initial code right now 
        public async Task<IActionResult> RegisterUserAsync(RegistrationRequestDto dto)
        {
            // Placeholder logic
            return await Task.FromResult(new OkObjectResult("Function reached successfully. DTO received!"));
        }

        public async Task<IActionResult> LoginUserAsync(LoginRequestDto dto)
        {
            // Placeholder logic
            JwtUtils agent = new JwtUtils(_config);
            User user = _context.Users.Find(1);
            if (user == null)
            {
                return await Task.FromResult(new UnauthorizedObjectResult("Invalid credentials"));
            }
            // will decrypt the encrypted string pass and get the hashed password and datetime comparing.
            var decryptedPass ="";


            if(dto.Password != user.Password)
            {
                return await Task.FromResult(new UnauthorizedObjectResult("Invalid credentials"));
            }

            return await Task.FromResult(new OkObjectResult(agent.GenerateJwtToken(user)));
        }
    }
}
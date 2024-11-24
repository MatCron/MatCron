using Backend.Common.Utilities;
using Backend.Data;
using Backend.DTOs;
using Backend.DTOs.Auth;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;


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

        public async Task<RepositoryResponse> LoginUserAsync(LoginRequestDto dto)
        {
            // Placeholder logic
            JwtUtils agent = new JwtUtils(_config);

            User user = await _context.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || user.Email != dto.Email)
            {
                return new RepositoryResponse(error: "User invalid");
            }
            // will decrypt the encrypted string pass and get the hashed password and datetime comparing.
            
            if(PasswordHelper.VerifyPassword(dto.Password, user.Password))
            {
                return new RepositoryResponse(error: "Password invalid");
            }

            //validate the token is not expired
            if (user.Token != null)
            {
                var (principals,error) = agent.ValidateToken(user.Token);
                if (principals != null)
                {
                    return new RepositoryResponse(data:new{ token = user.Token } );
                }
            }

            var _token = agent.GenerateJwtToken(user);
            return new RepositoryResponse(data: new { token = user.Token });
            

        }
    }
}
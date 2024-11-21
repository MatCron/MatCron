using Backend.Data;
using Backend.DTOs.Auth;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MatCron.Backend.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
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
            return await Task.FromResult(new OkObjectResult(new User
            {
                Id = 1,
                FirstName = "John",
                LastName = "Doe",
                Email = "jonh@doe.com"
            }));
        }
    }
}
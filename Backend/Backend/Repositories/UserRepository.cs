using Backend.Data;
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

        public async Task<IActionResult> RegisterUserAsync(RegistrationRequestDto dto)
        {
            try
            {
                // Validate if the organisation exists
                var organisation = await _context.Organisations.FindAsync(dto.OrgId);
                if (organisation == null)
                {
                    return new NotFoundObjectResult(new { success = false, message = "Organisation not found." });
                }

                // Check if a user with the same email already exists
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                {
                    return new BadRequestObjectResult(new { success = false, message = "Email is already registered." });
                }

                // Map DTO to User entity
                var newUser = new User
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    Password = dto.Password, // Ensure password is hashed in real applications
                    OrgId = dto.OrgId,
                    UserType = (byte)dto.UserType,
                    EmailVerified = 0 // Email verification pending
                };

                // Add and save the new user
                await _context.Users.AddAsync(newUser);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new { success = true, message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                return new StatusCodeResult(500); // Generic error message
            }
        }
    }
}
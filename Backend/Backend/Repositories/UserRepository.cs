using Backend.Common.Enums;
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

        // Function to get OrganisationId from OrganisationCode
        private async Task<int?> GetOrganisationIdByCodeAsync(string organisationCode)
        {
            var organisation = await _context.Organisations
                .FirstOrDefaultAsync(o => o.OrganisationCode == organisationCode);

            return organisation?.Id; // Returns null if not found
        }

        // Registration Function
        public async Task<IActionResult> RegisterUserAsync(RegistrationRequestDto dto)
        {
            try
            {
                // Retrieve the OrganisationId using the helper function
                var organisationId = await GetOrganisationIdByCodeAsync(dto.OrganisationCode);

                if (organisationId == null)
                {
                    return new NotFoundObjectResult(new
                    {
                        success = false,
                        message = "Invalid organisation code."
                    });
                }

                // Create a new User object
                var newUser = new User
                {
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Email = dto.Email,
                    Password = dto.Password,
                    OrgId = organisationId.Value, // Use the retrieved organisation ID
                    UserType = (byte)UserTypeEnum.Employee,
                    EmailVerified =(byte)EmailStatus.Pending,
                };

                // Add to database
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new
                {
                    success = true,
                    message = "User registered successfully.",
                    userId = newUser.Id
                });
            }
            catch (Exception ex)
            {
                return new ObjectResult(new
                {
                    success = false,
                    message = ex.Message
                })
                { StatusCode = 500 };
            }
        }
    }
}
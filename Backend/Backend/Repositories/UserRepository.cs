using Backend.Common.Enums;
using Backend.Data;
using MatCron.Backend.Common;
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

        private async Task<Guid?> GetOrganisationIdByCodeAsync(string organisationCode)
        {
            try
            {
                var organisation = await _context.Organisations
                    .AsNoTracking() // Avoid tracking for read-only operations
                    .FirstOrDefaultAsync(o => o.OrganisationCode == organisationCode);

                if (organisation == null)
                {
                    Console.WriteLine($"No organisation found for code: {organisationCode}");
                    return null;
                }

                Console.WriteLine($"Found organisation: {organisation.Name}, ID: {organisation.Id}");
                return organisation.Id;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving organisation by code: {ex.Message}");
                throw; // Rethrow for higher-level handling
            }
        }
        
       public async Task<IActionResult> RegisterUserAsync(RegistrationRequestDto dto)
{
    try
    {
        // Input validation
        if (string.IsNullOrWhiteSpace(dto.FirstName))
        {
            return new BadRequestObjectResult(new
            {
                success = false,
                message = "First Name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.LastName))
        {
            return new BadRequestObjectResult(new
            {
                success = false,
                message = "Last Name is required."
            });
        }

        if (string.IsNullOrWhiteSpace(dto.Email) || !IsValidEmail(dto.Email))
        {
            return new BadRequestObjectResult(new
            {
                success = false,
                message = "A valid Email is required."
            });
        }

        // Check for duplicate Full Name
        var fullNameExists = await _context.Users
            .AnyAsync(u => u.FirstName == dto.FirstName && u.LastName == dto.LastName);

        if (fullNameExists)
        {
            return new ConflictObjectResult(new
            {
                success = false,
                message = "A user with the same Full Name already exists."
            });
        }

        // Check for duplicate Email
        var emailExists = await _context.Users
            .AnyAsync(u => u.Email == dto.Email);

        if (emailExists)
        {
            return new ConflictObjectResult(new
            {
                success = false,
                message = "The Email Address is already in use."
            });
        }

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

        // Create a new User object using the Converter
        var newUser = Converter.ConvertToUser(dto, organisationId.Value);

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
        
        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
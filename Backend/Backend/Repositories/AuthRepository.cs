using System.Security.Cryptography;
using Backend.Common.Utilities;
using Backend.Common.Enums;

using Backend.DTOs;
using Backend.DTOs.Auth;
using MatCron.Backend.Common;
using MatCron.Backend.Data;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Mvc;

namespace MatCron.Backend.Repositories.Implementations
{
    public class AuthRepository : IAuthRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        public AuthRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
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
                dto.Password = PasswordHelper.DecryptPassword(dto.Password);

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
                

        
        public async Task<IActionResult> LoginUserAsync(LoginRequestDto dto)
        {
            try
            {
                JwtUtils agent = new JwtUtils(_config);

                // Step 1: Find user by email
                User user = await _context.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);

                if (user == null)
                {
                    return new NotFoundObjectResult(new { success = false, error = "User not found." });
                }

                // Step 2: Check if the user account is active
                if (user.Status != (byte)UserStatus.Active)
                {
                    return new UnauthorizedObjectResult(new { success = false, error = "User account is inactive. Please verify your email." });
                }

                // Step 3: Verify password
                // if (!PasswordHelper.VerifyPassword(dto.Password, user.Password))
                // {
                //     return new UnauthorizedObjectResult(new { success = false, error = "Invalid password." });
                // }
                
                
                // (For testing only! Not recommended for production)
                if (dto.Password != user.Password)
                {
                    return new NotFoundObjectResult(new { success = false, error = "User not found." });

                }

                // Step 4: Validate existing token
                if (!string.IsNullOrEmpty(user.Token))
                {
                    var (principals, error) = agent.ValidateToken(user.Token);
                    if (principals != null)
                    {
                        return new OkObjectResult(new { success = true, message = "Token validated", data = user });
                    }
                }

                // Step 5: Generate a new token
                var newToken = agent.GenerateJwtToken(user);
                user.Token = newToken;
                _context.Users.Update(user);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new { success = true, message = "New token generated", data = user });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Error] Login failed: {ex.Message}");
                return new ObjectResult(new { success = false, message = "An error occurred while logging in." }) { StatusCode = 500 };
            }
        }

        //
        // public async Task<IActionResult> LoginUserAsync(LoginRequestDto dto)
        // {
        //     // Placeholder logic
        //     JwtUtils agent = new JwtUtils(_config);
        //
        //     // 1. Find user by email
        //     User user = await _context.Users.SingleOrDefaultAsync(u => u.Email == dto.Email);
        //
        //     if (user == null || user.Email != dto.Email)
        //     {
        //         return new NotFoundObjectResult(new 
        //         { 
        //             success= false, 
        //             error= "User invalid" 
        //         });
        //     }
        //
        //     // 2. Compare passwords in plain text (not secure for production!)
        //     if (dto.Password != user.Password)
        //     {
        //         return new UnauthorizedObjectResult(new 
        //         { 
        //             success = false, 
        //             error = "Password invalid" 
        //         });
        //     }
        //
        //     // 3. Check if user's existing token is still valid
        //     if (user.Token != null)
        //     {
        //         var (principals, error) = agent.ValidateToken(user.Token);
        //         if (principals != null)
        //         {
        //             return new OkObjectResult(new 
        //             { 
        //                 success = true, 
        //                 message = "token validated", 
        //                 data = user 
        //             });
        //         }
        //     }
        //
        //     // 4. Generate a new token if no valid token
        //     var _token = agent.GenerateJwtToken(user);
        //     user.Token = _token;
        //     _context.Users.Update(user);
        //     await _context.SaveChangesAsync();
        //
        //     return new OkObjectResult(new 
        //     { 
        //         success = true, 
        //         message = "new token generated", 
        //         data = user 
        //     });
        // }
        //
        //
        
   

     
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
        

        private string GenerateVerificationToken()
            {
                var randomBytes = new byte[32];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(randomBytes);
                }
                return Convert.ToBase64String(randomBytes)
                    .Replace("+", "-")
                    .Replace("/", "_")
                    .Replace("=", "");
            }
        


        public string verifyPassword(string password)
        {
            return PasswordHelper.DecryptData(password, "encryptPassword");
        }
    }
}
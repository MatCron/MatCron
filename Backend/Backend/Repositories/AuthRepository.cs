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
        

                

        
        public async Task<IActionResult> LoginUserAsync(LoginRequestDto dto)
        {
            try
            {
                JwtUtils agent = new JwtUtils(_config);

                // Step 1: Find user by email
                User user = await _context.Users.Include(u => u.Organisation).SingleOrDefaultAsync(u => u.Email == dto.Email);

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
                if (!PasswordHelper.VerifyPassword(dto.Password, user.Password))
                {
                    return new UnauthorizedObjectResult(new { success = false, error = "Invalid password." });
                }
                
                
                // (For testing only! Not recommended for production)
                // if (dto.Password != user.Password)
                // {
                //     return new NotFoundObjectResult(new { success = false, error = "User not found." });
                //
                // }

                // Step 4: Validate existing token
                if (!string.IsNullOrEmpty(user.Token))
                {
                    var (principals, error) = agent.ValidateToken(user.Token);
                    if (principals != null )
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

 
        public async Task<VerifyEmailResponseDto> VerifyEmailTokenAsync(string token)
        {
            try
            {


                // 2. Find the user verification record with the given token
                var userVerification = await _context.UserVerifications
                    .Include(uv => uv.User)
                    .FirstOrDefaultAsync(uv => uv.EmailVerificationToken == token);

                if (userVerification == null)
                {
                    Console.WriteLine("[Debug] No user verification found with this token");
                    return new VerifyEmailResponseDto
                    {
                        IsValid = false,
                        Message = "Invalid verification token.",
                        Email = string.Empty
                    };
                }

                // Double-check the associated user for the following
                if (userVerification.User == null)
                {
                    Console.WriteLine("[Debug] userVerification.User is null! Possibly a broken foreign key reference.");
                    return new VerifyEmailResponseDto
                    {
                        IsValid = false,
                        Message = "No associated user found for this token.",
                        Email = string.Empty
                    };
                }

                Console.WriteLine($"[Debug] Found user verification for user: {userVerification.User.Email}");

                // 3. Check if the token has expired
                if (userVerification.TokenExpiration < DateTime.UtcNow)
                {
                    Console.WriteLine("[Debug] Token has expired");
                    return new VerifyEmailResponseDto
                    {
                        IsValid = false,
                        Message = "Verification token has expired.",
                        Email = userVerification.User.Email
                    };
                }

                // 4. Check if the token is already used
                if (userVerification.EmailConfirmed == (byte)VerificationStatus.Active)
                {
                    Console.WriteLine("[Debug] Email is already verified");
                    return new VerifyEmailResponseDto
                    {
                        IsValid = false,
                        Message = "Email is already verified.",
                        Email = userVerification.User.Email
                    };
                }

                // If we get here, token is valid
                Console.WriteLine("[Debug] Token is valid");
                return new VerifyEmailResponseDto
                {
                    IsValid = true,
                    Message = "Verification token is valid.",
                    Email = userVerification.User.Email
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Debug] Error verifying email token: {ex.Message}");
                return new VerifyEmailResponseDto
                {
                    IsValid = false,
                    Message = "An error occurred while verifying the token.",
                    Email = string.Empty
                };
            }
        }
        
        public async Task<IActionResult> CompleteRegistrationAsync(CompleteRegistrationDto registrationDto)
        {
            try
            {
                // 1. Find the user verification record with the given token
                var userVerification = await _context.UserVerifications
                    .Include(uv => uv.User)
                    .FirstOrDefaultAsync(uv => uv.EmailVerificationToken == registrationDto.Token);

                if (userVerification == null)
                {
                    return new BadRequestObjectResult(new
                    {
                        success = false,
                        message = "Invalid token."
                    });
                }

                // 2. Check if token is expired
                if (userVerification.TokenExpiration < DateTime.UtcNow)
                {
                    return new BadRequestObjectResult(new
                    {
                        success = false,
                        message = "Token has expired."
                    });
                }

                // 3. Check if already used
                if (userVerification.EmailConfirmed == (byte)VerificationStatus.Active)
                {
                    return new BadRequestObjectResult(new
                    {
                        success = false,
                        message = "Email is already verified."
                    });
                }

                // 4. Confirm user isn't null
                var user = userVerification.User;
                if (user == null)
                {
                    Console.WriteLine("CompleteRegistrationAsync: user is null for this token.");
                    return new BadRequestObjectResult(new
                    {
                        success = false,
                        message = "No user associated with this token."
                    });
                }

                // 5. Validate first & last name (optional but recommended)
                if (string.IsNullOrWhiteSpace(registrationDto.FirstName))
                {
                    return new BadRequestObjectResult(new { success = false, message = "First Name is required." });
                }
                if (string.IsNullOrWhiteSpace(registrationDto.LastName))
                {
                    return new BadRequestObjectResult(new { success = false, message = "Last Name is required." });
                }

                // 6. Decrypt the password from the front end
          
                string decryptedPassword;
                try
                {
                    decryptedPassword = PasswordHelper.DecryptPassword(registrationDto.Password);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Decryption error: {ex.Message}");
                    return new BadRequestObjectResult(new
                    {
                        success = false,
                        message = "Invalid or corrupt password encryption."
                    });
                }

                if (string.IsNullOrWhiteSpace(decryptedPassword))
                {
                    return new BadRequestObjectResult(new
                    {
                        success = false,
                        message = "Decrypted password is empty."
                    });
                }

                // 7. Update the user
                user.FirstName = registrationDto.FirstName;
                user.LastName = registrationDto.LastName;
                user.Password = decryptedPassword; // Store the decrypted password
                user.ProfilePicture = registrationDto.ProfilePicture;
                user.EmailVerified = (byte)EmailStatus.Verified;
                user.Status = (byte)UserStatus.Active;

                // 8. Mark verification as complete
                userVerification.EmailConfirmed = (byte)VerificationStatus.Active;
                userVerification.EmailVerificationToken = null;

                // 9. Save changes
                _context.Users.Update(user);
                _context.UserVerifications.Update(userVerification);
                await _context.SaveChangesAsync();

                return new OkObjectResult(new
                {
                    success = true,
                    message = "Registration completed successfully."
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error completing registration: {ex.Message}");
                return new ObjectResult(new
                {
                    success = false,
                    message = ex.Message
                })
                {
                    StatusCode = 500
                };
            }
        }

      
      
        public async Task<(User user, string token)> CreateUserAndVerificationAsync(EmailInvitationDto emailDto)
        {
            try
            {
                // Step 1: Validate email format , using the Validate Email 
                if (!IsValidEmail(emailDto.Email))
                {
                    throw new Exception("Invalid email format. Please enter a valid email.");
                }

                // Step 2: Check if email already exists
                bool emailExists = await _context.Users.AnyAsync(u => u.Email == emailDto.Email);
                if (emailExists)
                {
                    throw new Exception("A user with this email already exists.");
                }

                // Step 3: Generate token
                var token = GenerateVerificationToken();
                var tokenExpiration = DateTime.UtcNow.AddDays(7);

                // Step 4: Create the user
                var user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = emailDto.Email,
                    EmailVerified = (byte)EmailStatus.Pending,
                    UserRole = (byte)emailDto.UserRole,
                    Status = (byte)UserStatus.Inactive,
                    OrgId = emailDto.OrgId
                };

                // Step 5: Create the verification record
                var userVerification = new UserVerification
                {
                    UserId = user.Id,
                    EmailConfirmed = (byte)VerificationStatus.Pending,
                    EmailVerificationToken = token,
                    TokenExpiration = tokenExpiration
                };

                // Step 6: Save both to the database
                await _context.Users.AddAsync(user);
                await _context.UserVerifications.AddAsync(userVerification);
                await _context.SaveChangesAsync();

                return (user, token);
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine($"[Database Error] {dbEx.Message}");
                throw new Exception("An error occurred while saving to the database. Please try again later.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Error] {ex.Message}");
                throw new Exception($"An unexpected error occurred: {ex.Message}");
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



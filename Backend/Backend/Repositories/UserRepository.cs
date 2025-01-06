using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Backend.Common.Converters;
using Backend.Common.Utilities;
using Backend.DTOs.User;
using Backend.DTOs.Organisation;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Backend.Repositories.Interfaces;

namespace Backend.Repositories
{
    public class UserRepository :IUserRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JwtUtils _jwtUtils;
        public UserRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IConfiguration Iconfig)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _jwtUtils = new JwtUtils(Iconfig);
        }

        public async Task<UserDto> GetUserByIdAsync(string id)
        {
            User user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            UserDto userDto = UserConverter.ConvertToUserDto(user);
            Organisation organisation = await _context.Organisations.FindAsync(user.OrgId);
            if(organisation == null)
            {
                throw new Exception("Organisation not found");
            }
            userDto.organisation = new OrganisationSummariseResponseDto
            {
                Id = organisation.Id.ToString(),
                Name = organisation.Name,
                OrganisationType = organisation.OrganisationType
            };

            return userDto;
        }

        public async Task<UserDto> GetUserByEmailAsync(string email)
        {
            User user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) {
                throw new Exception("User not found");
            }
            UserDto userDto = UserConverter.ConvertToUserDto(user);
            Organisation organisation = await _context.Organisations.FindAsync(user.OrgId);
            if(organisation == null)
            {
                throw new Exception("Organisation not found");
            }
            userDto.organisation = new OrganisationSummariseResponseDto
            {
                Id = organisation.Id.ToString(),
                Name = organisation.Name,
                OrganisationType = organisation.OrganisationType
            };
            return userDto;
        }

        public async void ResetPassword(string newPassword)
        {
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", string.Empty);
            var (principals, error) = _jwtUtils.ValidateToken(token);

            User user = await _context.Users.FindAsync(principals.FindFirst(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            user.Password = newPassword;
            await _context.SaveChangesAsync();

        }

        public async void UpdateProfile(UserDto user)
        {
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", string.Empty);
            var (principals, error) = _jwtUtils.ValidateToken(token);

            User currentUser = await _context.Users.FindAsync(principals.FindFirst(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
            if (currentUser == null)
            {
                throw new Exception("User not found");
            }

            currentUser.FirstName = user.FirstName ?? currentUser.FirstName;
            currentUser.LastName = user.LastName ?? currentUser.LastName;
            await _context.SaveChangesAsync();
        }

        public async void DeleteProfile(string id)
        {
            User user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

        }

        public async void SelfDeleteProfile()
        {
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", string.Empty);
            var (principals, error) = _jwtUtils.ValidateToken(token);

            User user = await _context.Users.FindAsync(principals.FindFirst(c => c.Type == JwtRegisteredClaimNames.Sub).Value);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

    }
}

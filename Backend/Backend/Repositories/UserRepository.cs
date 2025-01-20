﻿using System.IdentityModel.Tokens.Jwt;
using Backend.Common.Converters;
using Backend.Common.Utilities;
using Backend.DTOs.Organisation;
using Backend.DTOs.User;
using Backend.Repositories.Interfaces;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class UserRepository : IUserRepository
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
            User user = await _context.Users.FindAsync(Guid.Parse(id));
            if (user == null)
            {
                throw new Exception("User not found");
            }
            UserDto userDto = UserConverter.ConvertToUserDto(user);
            Organisation organisation = await _context.Organisations.FindAsync(user.OrgId);
            if (organisation == null)
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
            if (user == null)
            {
                throw new Exception("User not found");
            }
            UserDto userDto = UserConverter.ConvertToUserDto(user);
            Organisation organisation = await _context.Organisations.FindAsync(user.OrgId);
            if (organisation == null)
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

        public async Task<UserDto> UpdateUserAsync(UserDto user)
        {
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", string.Empty);
            var (principals, error) = _jwtUtils.ValidateToken(token);
            //var id = principals?.Claims.FirstOrDefault(c => c.Type == "Id")?.Value;
            User currentUser = await _context.Users.FindAsync(Guid.Parse(user.Id));
            if (currentUser == null)
            {
                throw new Exception("User not found");
            }

            currentUser.FirstName = user.FirstName ?? currentUser.FirstName;
            currentUser.LastName = user.LastName ?? currentUser.LastName;
            await _context.SaveChangesAsync();

            return UserConverter.ConvertToUserDto(currentUser);
        }

        public async Task<bool> DeleteUser(string id)
        {
            User user = await _context.Users.FindAsync(Guid.Parse(id));
            if (user == null)
            {
                throw new Exception("User not found");
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;

        }

        public async void SelfDeleteProfile()
        {
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", string.Empty);
            var (principals, error) = _jwtUtils.ValidateToken(token);

            var id = principals?.Claims.FirstOrDefault(c => c.Type == "Id")?.Value;
            User user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

    }
}

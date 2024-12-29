using Backend.Common.Enums;
using Backend.Repositories.Interfaces;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using MatCron.Backend.Repositories.Interfaces;
using MatCron.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace MatCron.Backend.Repositories.Implementations
{
    public class GroupRepository : IGroupRepository
    {
        private readonly ApplicationDbContext _context;

        public GroupRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //Creating a New group With the Organisation 
        public async Task<GroupDto> CreateGroupAsync(GroupCreateDto dto)
        {
            // Check if the organisation exists
            var organisationExists = await _context.Organisations.AnyAsync(o => o.Id == dto.OrgId);
            if (!organisationExists)
            {
                throw new Exception("Invalid organisation ID. Organisation not found.");
            }

            // Check if the group name is unique within the organisation
            var groupNameExists = await _context.Groups.AnyAsync(g => g.Name == dto.Name && g.OrgId == dto.OrgId);
            if (groupNameExists)
            {
                throw new Exception($"A group with the name '{dto.Name}' already exists in the specified organisation.");
            }

            // Create the group entity
            var newGroup = new Group
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                OrgId = dto.OrgId,
                Status = GroupStatus.Active,
                CreatedDate = DateTime.UtcNow
            };

            // Save the group to the database
            _context.Groups.Add(newGroup);
            await _context.SaveChangesAsync();

            // Map the group entity to a DTO
            var groupDto = new GroupDto
            {
                Id = newGroup.Id,
                Name = newGroup.Name,
                Description = newGroup.Description,
                CreatedDate = newGroup.CreatedDate,
                Status = newGroup.Status
            };

            return groupDto;
        }
        
    }
}
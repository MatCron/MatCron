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
        
        //Adding Mattresses by selesting multiple mattresses and sending it along wit the group Id to add mattreses to a group 
        public async Task AddMattressesToGroupAsync(EditMattressesToGroupDto dto)
        {
            try
            {
                // Validate the group exists
                var groupExists = await _context.Groups.AnyAsync(g => g.Id == dto.GroupId);
                if (!groupExists)
                {
                    throw new Exception($"Group with ID {dto.GroupId} does not exist.");
                }

                // Validate all mattresses exist
                var validMattressIds = await _context.Mattresses
                    .Where(m => dto.MattressIds.Contains(m.Uid))
                    .Select(m => m.Uid)
                    .ToListAsync();

                var invalidMattresses = dto.MattressIds.Except(validMattressIds);
                if (invalidMattresses.Any())
                {
                    throw new Exception($"The following mattresses are invalid: {string.Join(", ", invalidMattresses)}");
                }

                // Add mattresses to the group
                var mattressGroups = dto.MattressIds.Select(mattressId => new MattressGroup
                {
                    MattressId = mattressId,
                    GroupId = dto.GroupId,
                    DateAssociated = DateTime.UtcNow
                });

                _context.MattressGroups.AddRange(mattressGroups);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log exception if needed
                throw new Exception($"An error occurred while adding mattresses to the group: {ex.Message}");
            }
        }
        
        
        
        public async Task<IEnumerable<GroupDto>> GetActiveGroupsByUserAsync(Guid userId)
        {
            try
            {
                // Find the user's organization
                var user = await _context.Users
                    .Include(u => u.Organisation)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null || user.Organisation == null)
                {
                    throw new Exception("User not found or the user is not associated with an organization.");
                }

                var orgId = user.Organisation.Id;

                // Fetch active groups for the user's organization
                var activeGroups = await _context.Groups
                    .Where(g => g.OrgId == orgId && g.Status == GroupStatus.Active)
                    .Select(g => new GroupDto
                    {
                        Id = g.Id,
                        Name = g.Name,
                        Description = g.Description,
                        CreatedDate = g.CreatedDate,
                        MattressCount = g.MattressGroups.Count
                    })
                    .ToListAsync();

                return activeGroups;
            }
            catch (Exception ex)
            {
                // Log the exception if necessary
                throw new Exception($"An error occurred while retrieving active groups: {ex.Message}");
            }
        }

        




    }
}
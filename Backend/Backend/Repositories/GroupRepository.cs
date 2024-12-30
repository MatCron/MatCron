using Backend.Common.Enums;
using Backend.DTOs.Mattress;
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
        try
        {
            // Validate sender organization
            var senderExists = await _context.Organisations.AnyAsync(o => o.Id == dto.SenderOrgId);
            if (!senderExists)
            {
                throw new Exception($"Sender organization with ID {dto.SenderOrgId} does not exist.");
            }

            // Validate receiver organization
            var receiverExists = await _context.Organisations.AnyAsync(o => o.Id == dto.ReceiverOrgId);
            if (!receiverExists)
            {
                throw new Exception($"Receiver organization with ID {dto.ReceiverOrgId} does not exist.");
            }

            // Validate group name uniqueness
            var groupNameExists = await _context.Groups.AnyAsync(g =>
                g.Name == dto.Name && g.SenderOrgId == dto.SenderOrgId);
            if (groupNameExists)
            {
                throw new Exception($"A group with the name '{dto.Name}' already exists for the sender organization.");
            }

            // Create the group entity
            var newGroup = new Group
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                SenderOrgId = dto.SenderOrgId,
                ReceiverOrgId = dto.ReceiverOrgId,
                Status = GroupStatus.Active,
                CreatedDate = DateTime.UtcNow
            };

            _context.Groups.Add(newGroup);
            await _context.SaveChangesAsync();

            // Map the group entity to a DTO
            return new GroupDto
            {
                Id = newGroup.Id,
                Name = newGroup.Name,
                Description = newGroup.Description,
                CreatedDate = newGroup.CreatedDate,
                Status = newGroup.Status
            };
        }
        catch (Exception ex)
        {
            // Log full exception details
            Console.WriteLine($"Error: {ex.Message}");
            if (ex.InnerException != null)
            {
                Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
            }
            throw new Exception($"An error occurred while creating the group: {ex.Message}");
        }
    }
        
        
        //Adding Mattresses by selesting multiple mattresses and sending it along wit the group Id to add mattreses to a group 

        
 

    }
}
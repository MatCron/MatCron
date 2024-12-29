using MatCron.Backend.DTOs;

namespace Backend.Repositories.Interfaces;



public interface IGroupRepository
{
    Task<GroupDto> CreateGroupAsync(GroupCreateDto dto);
    Task AddMattressesToGroupAsync(EditMattressesToGroupDto dto);
    //
    // Task<IEnumerable<GroupDto>> GetActiveGroupsByUserAsync(Guid userId);
    // Task<IEnumerable<GroupDto>> GetArchivedGroupsAsync(Guid orgId);
    // Task RemoveMattressFromGroupAsync(Guid groupId, Guid mattressId);
    // Task ImportGroupAsync(Guid groupId, Guid newOrgId);
    // Task TransferOutGroupAsync(Guid groupId, Guid destinationOrgId, string purpose);
}
using Backend.DTOs.Mattress;
using MatCron.Backend.DTOs;

namespace Backend.Repositories.Interfaces;



public interface IGroupRepository
{
    Task<GroupDto> CreateGroupAsync(GroupCreateDto dto);
    Task<IEnumerable<GroupDto>> GetGroupsByStatusAsync(GroupRequestDto requestDto);
    Task AddMattressesToGroupAsync(EditMattressesToGroupDto dto);

    Task<GroupWithMattressesDto> GetGroupByIdAsync(Guid groupId);
 
    Task RemoveMattressesFromGroupAsync(EditMattressesToGroupDto dto);
    Task TransferOutGroupAsync(Guid groupId);
    Task<GroupDto> ImportPreview(Guid mattressId);
    Task ImportMattressesFromGroupAsync(Guid groupId);

    Task<List<string>> getOrgidsOfGroup(Guid groupId);
    // Task EditGroupAsync(EditGroupDto dto);

}
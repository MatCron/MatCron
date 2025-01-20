using Backend.DTOs.Mattress;
using MatCron.Backend.DTOs;

namespace Backend.Repositories.Interfaces;



public interface IGroupRepository
{
    Task<GroupDto> CreateGroupAsync(GroupCreateDto dto);
    Task<IEnumerable<GroupDto>> GetGroupsByStatusAsync(GroupRequestDto requestDto);
    Task AddMattressesToGroupAsync(EditMattressesToGroupDto dto);
    Task<IEnumerable<MattressDto>> GetMattressesByGroupIdAsync(Guid groupId);
 
    Task RemoveMattressesFromGroupAsync(EditMattressesToGroupDto dto);
    Task TransferOutGroupAsync(Guid groupId);
    Task<GroupDto> ImportPreview(Guid mattressId);
    Task ImportMattressesFromGroupAsync(Guid groupId);

    // Task EditGroupAsync(EditGroupDto dto);

}
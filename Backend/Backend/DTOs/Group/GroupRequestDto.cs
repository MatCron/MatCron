using Backend.Common.Enums;

namespace MatCron.Backend.DTOs;

public class GroupRequestDto
{
    public Guid UserId { get; set; } // Used for active groups
    public GroupStatus GroupStatus { get; set; } // Enum for group status (Active/Archived)
    
}
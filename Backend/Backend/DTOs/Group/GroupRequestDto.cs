using Backend.Common.Enums;

namespace MatCron.Backend.DTOs;

public class GroupRequestDto
{
    public GroupStatus GroupStatus { get; set; } // Enum for group status (Active/Archived)
}
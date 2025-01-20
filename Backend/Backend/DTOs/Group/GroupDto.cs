using Backend.Common.Enums;

namespace MatCron.Backend.DTOs
{
    public class GroupDto
    {
        public Guid Id { get; set; } // Unique identifier for the group
        public string Name { get; set; } // Name of the group
        public string? Description { get; set; } // Optional description
        public DateTime CreatedDate { get; set; } // Date the group was created
        public GroupStatus Status { get; set; } // Status (Active/Archived)
        public int MattressCount { get; set; } // Count of mattresses in this group
        public string? ReceiverOrganisationName { get; set; } // New property
        public string? SenderOrganisationName { get; set; } // Sender Organisation Name (New property)
        public TransferOutPurpose? TransferOutPurpose{ get; set; } 
        
    }
}
using System;
using System.Collections.Generic;
using Backend.Common.Enums;

namespace MatCron.Backend.Entities
{
    public class Group
    {
        public Guid Id { get; set; }             // Primary Key
        public Guid OrgId { get; set; }          // Foreign Key to Organisation

        // Overall lifecycle status: Active or Archived
        public GroupStatus Status { get; set; } = GroupStatus.Active;

        // Context-specific status (TransferredOut, TransferredIn, etc.)
        public ProcessStatus ProcessStatus { get; set; } = ProcessStatus.None;

        public string ContactNumber { get; set; } // Contact Information

        // Optionally track creation/update times if desired
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }

        // Navigation Properties
        public Organisation Organisation { get; set; }  // Many-to-One with Organisation

        // One-to-Many with Users
        public ICollection<User> Users { get; set; } = new List<User>();

        // Many-to-Many via MattressGroup
        public ICollection<MattressGroup> MattressGroups { get; set; } = new List<MattressGroup>();
    }
}
using System;
using System.Collections.Generic;

namespace MatCron.Backend.Entities
{
    public class Group
    {
        public Guid Id { get; set; }  // Primary Key
        public Guid OrganisationId { get; set; }  // Foreign Key to Organisation
        public byte? Status { get; set; }  // Optional Status
        public string ContactNumber { get; set; }  // Contact Information

        // Navigation Properties
        public Organisation Organisation { get; set; }  // Many-to-One with Organisation
        public ICollection<User> Users { get; set; } = new List<User>();  // One-to-Many with Users
        public ICollection<MattressGroup> MattressGroups { get; set; } = new List<MattressGroup>(); // Many-to-Many via MattressGroup

    }
}
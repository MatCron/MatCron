using System;
using System.Collections.Generic;
using Backend.Common.Enums;

namespace MatCron.Backend.Entities
{
    public class Group
    {
        public Guid Id { get; set; }             
        public Guid OrgId { get; set; }     
   
        public string Name { get; set; }
        public string? Description { get; set; }
        public GroupStatus Status { get; set; }
      

        public DateTime CreatedDate { get; set; } 
        public DateTime? ModifiedDate { get; set; }
        public Organisation Organisation { get; set; }  

        // Navigation Properties
     
        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<MattressGroup> MattressGroups { get; set; } = new List<MattressGroup>();
    }
}
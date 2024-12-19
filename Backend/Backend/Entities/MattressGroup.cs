using System;

namespace MatCron.Backend.Entities
{
    public class MattressGroup
    {
        public Guid MattressId { get; set; }  
        public Guid GroupId { get; set; }  

        // Navigation Properties
        public Mattress Mattress { get; set; }
        public Group Group { get; set; }
    }
}
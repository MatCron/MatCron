using System;

namespace MatCron.Backend.Entities
{
    public class LocationMattress
    {
        public Guid Id { get; set; } // Primary Key
        public string Name { get; set; }
        public string Description { get; set; }
        public byte Status { get; set; }

        // Navigation Property
        public ICollection<Mattress> Mattresses { get; set; } = new List<Mattress>();
    }
}
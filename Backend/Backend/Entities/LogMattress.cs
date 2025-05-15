using System;

namespace MatCron.Backend.Entities
{
    public class LogMattress
    {
        public Guid Id { get; set; } // Primary Key
        public Guid ObjectId { get; set; } // Foreign Key
        public byte Status { get; set; }
        public string Details { get; set; }
        public byte Type { get; set; }
        public DateTime TimeStamp { get; set; }

        // Navigation Property
        //public Mattress Mattress { get; set; }
    }
}
﻿using System;

namespace MatCron.Backend.Entities
{
    public class LogMattress
    {
        public Guid Id { get; set; } // Primary Key
        public Guid MattressId { get; set; } // Foreign Key
        public string Status { get; set; }
        public string Details { get; set; }
        public string Type { get; set; }
        public DateTime TimeStamp { get; set; }

        // Navigation Property
        public Mattress Mattress { get; set; }
    }
}
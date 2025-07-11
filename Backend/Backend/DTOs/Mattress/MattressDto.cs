﻿using MatCron.Backend.Entities;

namespace Backend.DTOs.Mattress
{
    public class MattressDto
    {
        public string? Uid { get; set; } // Primary Key
        public string? MattressTypeId { get; set; } // Foreign Key to MattressType
        public string? BatchNo { get; set; }
        public string? MattressTypeName { get; set; }
        public DateTime? ProductionDate { get; set; }
        public string? OrgId { get; set; } // Foreign Key to User
        public string? EpcCode { get; set; }
        public string? location { get; set; }
        public int? Status { get; set; }
        public DateTime? LifeCyclesEnd { get; set; }
        public int? DaysToRotate { get; set; }
        public DateTime? LatestDateRotate { get; set; }

    }
}

using System;
using System.Collections.Generic;

namespace MatCron.Backend.Entities
{
    public class Mattress
    {
        public Guid Uid { get; set; }  
        public Guid MattressTypeId { get; set; }  
        public Guid? OrgId { get; set; }  
        public string? Location { get; set; }  

        public string? BatchNo { get; set; }  
        public DateTime? ProductionDate { get; set; }  
        public string? EpcCode { get; set; }  
        public byte Status { get; set; }  
        public DateTime? LifeCyclesEnd { get; set; }  
        public int DaysToRotate { get; set; }  
        public DateTime? LatestDateRotate { get; set; }

        // Navigation Properties
        public MattressType MattressType { get; set; }
        public Organisation? Organisation { get; set; }
        //public LocationMattress? Location { get; set; }
        public ICollection<LogMattress> Logs { get; set; } = new List<LogMattress>();
        public ICollection<MattressGroup> MattressGroups { get; set; } = new List<MattressGroup>();

 
    }
}
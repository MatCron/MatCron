namespace MatCron.Backend.Entities
{
    public class Mattress
    {
        public Guid Uid { get; set; } // Primary Key
        public Guid MattressTypeId { get; set; } // Foreign Key to MattressType
        public string? BatchNo { get; set; }
        public DateTime ProductionDate { get; set; }
        public Guid GroupId { get; set; } // Foreign Key to Group
        public Guid? OrgId { get; set; } // Foreign Key to User
        public string? EpcCode { get; set; }
        public byte Status { get; set; }
        public DateTime? LifeCyclesEnd { get; set; }
        public int DaysToRotate { get; set; }

        // Navigation Properties
        public MattressType MattressType { get; set; }
        public Group? Group { get; set; }
        public User? User { get; set; }
        public ICollection<Log>? Logs { get; set; } = new List<Log>();
    }
}
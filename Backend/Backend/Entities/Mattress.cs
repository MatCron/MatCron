namespace MatCron.Backend.Entites
{
    public class Mattress
    {
        public int Uid { get; set; } // Primary Key
        public int TypeId { get; set; } // Foreign Key to MattressType
        public string BatchNo { get; set; }
        public DateTime ProductionDate { get; set; }
        public int GroupId { get; set; } // Foreign Key to Group
        public int UserId { get; set; } // Foreign Key to User
        public string EpcCode { get; set; }
        public string Status { get; set; }
        public DateTime? LifeCyclesEnd { get; set; }
        public int DaysToRotate { get; set; }

        // Navigation Properties
        public MattressType Type { get; set; }
        public Group Group { get; set; }
        public User User { get; set; }
        public ICollection<Log> Logs { get; set; }
    }
}

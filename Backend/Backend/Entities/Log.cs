namespace MatCron.Backend.Entities
{
    public class Log
    {
        public int Id { get; set; } // Primary Key
        public int MattressId { get; set; } // Foreign Key to Mattress
        public string Status { get; set; }
        public string Detail { get; set; }
        public string Type { get; set; }

        // Navigation Property
        public Mattress Mattress { get; set; }
    }
}

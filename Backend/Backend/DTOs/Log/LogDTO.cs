namespace Backend.DTOs.Log
{
    public class LogDTO
    {
        public string Id { get; set; }
        public string MattressId { get; set; }
        public byte Status { get; set; }
        public string Details { get; set; }
        public byte Type { get; set; }
        public string TimeStamp { get; set; }
    }
}

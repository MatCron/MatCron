namespace Backend.DTOs.Mattress
{
    public class MattressImportedDto
    {
        public string id { set; get; }
        public string type { set; get; }
        public string location { set; get; }
        public byte status { set; get; }
        public int DaysToRotate { get; set; }
        public DateTime? LifeCyclesEnd { get; set; }
        public string organisation { set; get; }
    }
}

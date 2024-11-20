namespace MatCron.Backend.Entities
{
    public class MattressGroup
    {
        public int Id { get; set; } 
        public int GroupId { get; set; }  // foriegn key from group 
        public int MattressId { get; set; } // foriegn key from mattress 
   
    }
}

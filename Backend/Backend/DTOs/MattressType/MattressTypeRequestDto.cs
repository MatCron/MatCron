namespace MatCron.Backend.DTOs
{
    public class MattressTypeRequestDto // Created this so that the Id request for the type for fetching data for one mattress type info and also editing one mattresss type  info would require this request which sends a id 
    {
        public Guid Id { get; set; } // Guid for Mattress Type
    }
}
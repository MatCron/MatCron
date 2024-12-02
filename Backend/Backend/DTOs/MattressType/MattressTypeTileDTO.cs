namespace MatCron.Backend.DTOs
{
    public class MattressTypeTileDTO
    {
        public Guid Id { get; set; } // Unique Identifier
        public string Name { get; set; } // Mattress Type Name
        public double Width { get; set; } // Mattress Width
        public double Length { get; set; } // Mattress Length
        public double Height { get; set; } // Mattress Height
        public double Stock { get; set; } // Stock Value
    }
}
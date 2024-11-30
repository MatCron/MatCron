namespace MatCron.Backend.Entities
{
    public class MattressType
    {
        public Guid Id { get; set; } 
        public string Name { get; set; } 
        public double Width { get; set; }
        public double Length { get; set; }
        public double Height { get; set; }
        public string Composition { get; set; } 
        public byte Washable { get; set; }
        public double RotationInterval { get; set; }
        public string RecyclingDetails { get; set; }
        public double ExpectedLifespan { get; set; }
        public double WarrantyPeriod { get; set; }

        // Navigation Properties
        public ICollection<Mattress> Mattresses { get; set; } = new List<Mattress>(); // Non-nullable
    }
}
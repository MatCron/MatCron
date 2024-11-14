namespace MatCron.Backend.Entities
{
    public class MattressType
    {
        public int Id { get; set; } // Primary Key
        public double Width { get; set; }
        public double Length { get; set; }
        public double Height { get; set; }
        public string? Composition { get; set; }
        public bool Washable { get; set; }
        public string? Name { get; set; }
        public int RotationInterval { get; set; }
        public string? RecyclingDetails { get; set; }
        public int ExpectedLifespan { get; set; }
        public int WarrantyPeriod { get; set; }
        public ICollection<Mattress>? Mattresses { get; set; }
    }
}

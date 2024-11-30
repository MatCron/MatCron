namespace MatCron.Backend.DTOs;

// Created this so  fetch all the data inside a tile for the Mattres Type and woould be used for Editing the Mattress Type 
public class MattressTypeDTO
{  public Guid Id { get; set; }
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
    public double Stock { get; set; }
}
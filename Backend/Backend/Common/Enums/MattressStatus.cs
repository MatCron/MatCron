namespace Backend.Common.Enums
{
    public enum MattressStatus
    {
        InProduction = 0,   // Mattress is being manufactured
        InInventory = 1,    // Mattress is stored in inventory
        Assigned = 2,       // Mattress is assigned to a customer or location
        InUse = 3,          // Mattress is actively in use
        NeedsCleaning = 4,  // Mattress requires cleaning or maintenance
        Decommissioned = 5  // Mattress is no longer in service
    }
}
using MatCron.Backend.Entities;

namespace MatCron.Backend.Entities
{
    public class MattressIdentifierPool
    {
        public Guid Id { get; set; }
        public Guid OrgId { get; set; }
        public string MattressIdentifier { get; set; } // Custom identifier
        public string EpcCode { get; set; } // Electronic Product Code
        public string QrCodeBase64 { get; set; } // Base64 encoded QR code image
        public bool IsAssigned { get; set; } // Track if this ID has been assigned
        public DateTime CreatedDate { get; set; }
        public DateTime? AssignedDate { get; set; }
        public Guid? AssignedToMattressId { get; set; } // Reference to assigned mattress
        
        // Navigation properties
        public Organisation Organisation { get; set; }
        public Mattress AssignedMattress { get; set; }
    }
}
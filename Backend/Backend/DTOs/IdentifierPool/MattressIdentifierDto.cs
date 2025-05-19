using System;

namespace Backend.DTOs.IdentifierPool
{
    /// <summary>
    /// Data Transfer Object for a Mattress Identifier
    /// </summary>
    public class MattressIdentifierDto
    {
        /// <summary>
        /// Unique identifier for the mattress identifier record
        /// </summary>
        public string Id { get; set; }
        
        /// <summary>
        /// The mattress identifier code (could be a serial number, custom code, etc.)
        /// </summary>
        public string MattressIdentifier { get; set; }
        
        /// <summary>
        /// Electronic Product Code (EPC) used for RFID tracking
        /// </summary>
        public string EpcCode { get; set; }
        
        /// <summary>
        /// Base64 encoded QR code image
        /// </summary>
        public string QrCodeBase64 { get; set; }
        
        /// <summary>
        /// Indicates whether this identifier has been assigned to a mattress
        /// </summary>
        public bool IsAssigned { get; set; }
        
        /// <summary>
        /// When the identifier was created
        /// </summary>
        public DateTime CreatedDate { get; set; }
        
        /// <summary>
        /// When the identifier was assigned to a mattress (if applicable)
        /// </summary>
        public DateTime? AssignedDate { get; set; }
        
        /// <summary>
        /// ID of the mattress this identifier is assigned to (if any)
        /// </summary>
        public string AssignedToMattressId { get; set; }
    }
} 
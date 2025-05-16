using System;

namespace Backend.DTOs.IdentifierPool
{
    /// <summary>
    /// Data Transfer Object for a Mattress Identifier
    /// </summary>
    public class MattressIdentifierDto
    {

        public string Id { get; set; }
        public string MattressIdentifier { get; set; }
        public string EpcCode { get; set; }
        public string QrCodeBase64 { get; set; }
        public bool IsAssigned { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? AssignedDate { get; set; }
        public string AssignedToMattressId { get; set; }
    }
}
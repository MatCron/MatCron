using System;

namespace Backend.DTOs.IdentifierPool
{
    /// <summary>
    /// Request to assign an identifier to a mattress
    /// </summary>
    public class AssignIdentifierRequest
    {
        /// <summary>
        /// The EPC code to assign
        /// </summary>
        public string EpcCode { get; set; }
        
        /// <summary>
        /// The ID of the mattress to assign the identifier to
        /// </summary>
        public Guid MattressId { get; set; }
    }
} 
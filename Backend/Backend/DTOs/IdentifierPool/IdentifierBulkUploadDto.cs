using System.Collections.Generic;

namespace Backend.DTOs.IdentifierPool
{
    /// <summary>
    /// Data for a bulk upload of mattress identifiers
    /// </summary>
    public class IdentifierBulkUploadDto
    {
        /// <summary>
        /// Collection of identifiers to upload
        /// </summary>
        public List<MattressIdentifierDto> Identifiers { get; set; }
    }
} 
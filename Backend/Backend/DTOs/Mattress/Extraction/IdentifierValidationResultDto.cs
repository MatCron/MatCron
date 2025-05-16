namespace Backend.DTOs.IdentifierPool
{
    /// <summary>
    /// Validation result for a single mattress identifier
    /// </summary>
    public class IdentifierValidationRowDto
    {
        /// <summary>
        /// The mattress identifier code
        /// </summary>
        public string MattressIdentifier { get; set; }
        
        /// <summary>
        /// Electronic Product Code (EPC)
        /// </summary>
        public string EpcCode { get; set; }
        
        /// <summary>
        /// Base64 encoded QR code image
        /// </summary>
        public string QrCodeBase64 { get; set; }
        
        /// <summary>
        /// Validation status ("success", "warning", or "error")
        /// </summary>
        public string Status { get; set; }
        
        /// <summary>
        /// Description of validation issue (if any)
        /// </summary>
        public string Message { get; set; }
    }
}
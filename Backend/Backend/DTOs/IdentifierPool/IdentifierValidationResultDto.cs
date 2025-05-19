using System.Collections.Generic;

namespace Backend.DTOs.IdentifierPool
{
    /// <summary>
    /// Result of validating a collection of mattress identifiers
    /// </summary>
    public class IdentifierValidationResultDto
    {
        /// <summary>
        /// Overall status of the validation ("success", "warning", or "error")
        /// </summary>
        public string Status { get; set; }
        
        /// <summary>
        /// Whether the validation passed (no errors)
        /// </summary>
        public bool IsValid { get; set; }
        
        /// <summary>
        /// Total number of identifiers processed
        /// </summary>
        public int TotalCount { get; set; }
        
        /// <summary>
        /// Number of valid identifiers
        /// </summary>
        public int ValidCount { get; set; }
        
        /// <summary>
        /// Number of identifiers with warnings
        /// </summary>
        public int WarningCount { get; set; }
        
        /// <summary>
        /// Number of identifiers with errors
        /// </summary>
        public int ErrorCount { get; set; }
        
        /// <summary>
        /// Collection of valid identifiers (those without errors)
        /// </summary>
        public List<MattressIdentifierDto> ValidData { get; set; }
        
        /// <summary>
        /// Detailed validation results for all rows, including success, warning, and error status
        /// </summary>
        public List<IdentifierValidationRowDto> AllRows { get; set; }
    }
} 
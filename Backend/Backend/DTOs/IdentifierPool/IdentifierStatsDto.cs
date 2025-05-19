namespace Backend.DTOs.IdentifierPool
{
    /// <summary>
    /// Statistics about the identifier pool for an organization
    /// </summary>
    public class IdentifierStatsDto
    {
        /// <summary>
        /// Total number of identifiers in the pool
        /// </summary>
        public int TotalCount { get; set; }
        
        /// <summary>
        /// Number of assigned identifiers
        /// </summary>
        public int AssignedCount { get; set; }
        
        /// <summary>
        /// Number of available identifiers
        /// </summary>
        public int AvailableCount { get; set; }
        
        /// <summary>
        /// Percentage of identifiers that are assigned
        /// </summary>
        public double PercentAssigned { get; set; }
    }
} 
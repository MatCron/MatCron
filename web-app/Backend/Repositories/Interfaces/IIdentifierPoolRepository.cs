using Backend.DTOs.IdentifierPool;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories.Interfaces
{
    public interface IIdentifierPoolRepository
    {
        /// <summary>
        /// Get all identifiers for an organization, optionally filtered by assignment status
        /// </summary>
        /// <param name="orgId">Organization ID (null to use from token)</param>
        /// <param name="assigned">Filter by assignment status (null for all)</param>
        /// <returns>List of mattress identifiers</returns>
        Task<List<MattressIdentifierDto>> GetIdentifiersForOrgAsync(Guid? orgId = null, bool? assigned = null);
        
        /// <summary>
        /// Get a specific identifier by ID
        /// </summary>
        /// <param name="id">Identifier ID</param>
        /// <returns>Mattress identifier or null if not found</returns>
        Task<MattressIdentifierDto> GetIdentifierByIdAsync(Guid id);
        
        /// <summary>
        /// Get a specific identifier by EPC code
        /// </summary>
        /// <param name="epcCode">EPC code</param>
        /// <returns>Mattress identifier or null if not found</returns>
        Task<MattressIdentifierDto> GetIdentifierByEpcCodeAsync(string epcCode);
        
        /// <summary>
        /// Validate a collection of identifiers
        /// </summary>
        /// <param name="identifiers">Identifiers to validate</param>
        /// <returns>Validation results</returns>
        Task<IdentifierValidationResultDto> ValidateIdentifiersAsync(List<MattressIdentifierDto> identifiers);
        
        /// <summary>
        /// Save a collection of validated identifiers
        /// </summary>
        /// <param name="identifiers">Identifiers to save</param>
        /// <returns>True if successful, false otherwise</returns>
        Task<bool> SaveIdentifiersAsync(List<MattressIdentifierDto> identifiers);
        
        /// <summary>
        /// Mark an identifier as assigned to a mattress
        /// </summary>
        /// <param name="epcCode">EPC code to mark as assigned</param>
        /// <param name="mattressId">ID of the mattress</param>
        /// <returns>True if successful, false otherwise</returns>
        Task<bool> MarkIdentifierAsAssignedAsync(string epcCode, Guid mattressId);
        
        /// <summary>
        /// Delete an identifier
        /// </summary>
        /// <param name="id">Identifier ID</param>
        /// <returns>True if successful, false otherwise</returns>
        Task<bool> DeleteIdentifierAsync(Guid id);
        
        /// <summary>
        /// Get the next available unassigned identifier
        /// </summary>
        /// <param name="orgId">Organization ID</param>
        /// <returns>Mattress identifier or null if none available</returns>
        Task<MattressIdentifierDto> GetNextAvailableIdentifierAsync(Guid orgId);
        
        /// <summary>
        /// Process an Excel file to extract mattress identifiers
        /// </summary>
        /// <param name="file">Excel file to process</param>
        /// <returns>Validation results for the extracted identifiers</returns>
        Task<IdentifierValidationResultDto> ProcessExcelFileAsync(IFormFile file);
    }
} 
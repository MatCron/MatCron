using Backend.DTOs.IdentifierPool;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories.Interfaces
{
    public interface IIdentifierPoolRepository
    {
        // Get all identifiers for an organization
        Task<List<MattressIdentifierDto>> GetIdentifiersForOrgAsync(Guid? orgId = null, bool? assigned = null);
        
        // Get a specific identifier by ID
        Task<MattressIdentifierDto> GetIdentifierByIdAsync(Guid id);
        
        // Get a specific identifier by EPC code
        Task<MattressIdentifierDto> GetIdentifierByEpcCodeAsync(string epcCode);
        
        // Validate identifiers before saving
        Task<IdentifierValidationResultDto> ValidateIdentifiersAsync(List<MattressIdentifierDto> identifiers);
        
        // Save validated identifiers
        Task<bool> SaveIdentifiersAsync(List<MattressIdentifierDto> identifiers);
        
        // Mark an identifier as assigned to a mattress
        Task<bool> MarkIdentifierAsAssignedAsync(string epcCode, Guid mattressId);
        
        // Delete an identifier
        Task<bool> DeleteIdentifierAsync(Guid id);
        
        // Get the next available identifier for an organization
        Task<MattressIdentifierDto> GetNextAvailableIdentifierAsync(Guid orgId);
        
        // Process an Excel file containing IDs and QR codes
        Task<IdentifierValidationResultDto> ProcessExcelFileAsync(IFormFile file);
    }
}
using Backend.Common.Utilities;
using Backend.DTOs.IdentifierPool;
using Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class IdentifierPoolController : ControllerBase
    {
        private readonly IIdentifierPoolRepository _identifierPoolRepository;

        public IdentifierPoolController(IIdentifierPoolRepository identifierPoolRepository)
        {
            _identifierPoolRepository = identifierPoolRepository;
        }

        /// <summary>
        /// Get all identifiers in the pool
        /// </summary>
        /// <param name="assigned">Filter by assignment status (optional)</param>
        /// <returns>List of identifiers</returns>
        [HttpGet]
        public async Task<ActionResult<List<MattressIdentifierDto>>> GetIdentifiers([FromQuery] bool? assigned = null)
        {
            try
            {
                var identifiers = await _identifierPoolRepository.GetIdentifiersForOrgAsync(assigned: assigned);
                return Ok(identifiers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get identifier pool statistics
        /// </summary>
        /// <returns>Statistics about the identifier pool</returns>
        [HttpGet("stats")]
        public async Task<ActionResult<IdentifierStatsDto>> GetStats()
        {
            try
            {
                // Get all identifiers
                var identifiers = await _identifierPoolRepository.GetIdentifiersForOrgAsync();
                
                // Calculate stats
                var totalCount = identifiers.Count;
                var assignedCount = identifiers.Count(i => i.IsAssigned);
                var availableCount = totalCount - assignedCount;
                var percentAssigned = totalCount > 0 ? (double)assignedCount / totalCount * 100 : 0;
                
                return Ok(new IdentifierStatsDto
                {
                    TotalCount = totalCount,
                    AssignedCount = assignedCount,
                    AvailableCount = availableCount,
                    PercentAssigned = percentAssigned
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Get a specific identifier by ID
        /// </summary>
        /// <param name="id">Identifier ID</param>
        /// <returns>Mattress identifier</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<MattressIdentifierDto>> GetIdentifier(string id)
        {
            try
            {
                if (!Guid.TryParse(id, out Guid identifierId))
                {
                    return BadRequest(new { message = "Invalid identifier ID format" });
                }
                
                var identifier = await _identifierPoolRepository.GetIdentifierByIdAsync(identifierId);
                
                if (identifier == null)
                {
                    return NotFound(new { message = "Identifier not found" });
                }
                
                return Ok(identifier);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Upload and validate an Excel file with identifiers
        /// </summary>
        /// <param name="file">Excel file with identifiers</param>
        /// <returns>Validation results</returns>
        [HttpPost("upload")]
        public async Task<ActionResult<IdentifierValidationResultDto>> UploadFile(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded" });
                }
                
                var result = await _identifierPoolRepository.ProcessExcelFileAsync(file);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        /// <summary>
        /// Save multiple identifiers to the pool
        /// </summary>
        /// <param name="identifiers">List of validated identifiers to save</param>
        /// <returns>Success/failure result</returns>
        [HttpPost("bulk-save")]
        public async Task<ActionResult> BulkSave([FromBody] List<MattressIdentifierDto> identifiers)
        {
            try
            {
                Console.WriteLine($"Received bulk save request with {identifiers?.Count ?? 0} identifiers");
                
                if (identifiers == null || identifiers.Count == 0)
                {
                    return BadRequest(new { success = false, message = "No identifiers provided" });
                }
                
                // Validate the identifiers first
                var validationResult = await _identifierPoolRepository.ValidateIdentifiersAsync(identifiers);
                
                if (!validationResult.IsValid)
                {
                    return BadRequest(new { 
                        success = false, 
                        message = "Validation failed",
                        validationResult = validationResult
                    });
                }
                
                // Save only the valid identifiers
                var saveResult = await _identifierPoolRepository.SaveIdentifiersAsync(validationResult.ValidData);
                
                if (saveResult)
                {
                    return Ok(new { 
                        success = true, 
                        message = $"Successfully saved {validationResult.ValidData.Count} identifiers" 
                    });
                }
                else
                {
                    return StatusCode(500, new { success = false, message = "Failed to save identifiers" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in bulk save: {ex.Message}");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        /// <summary>
        /// Assign an identifier to a mattress
        /// </summary>
        /// <param name="request">Assignment request with EPC code and mattress ID</param>
        /// <returns>Success/failure result</returns>
        [HttpPost("assign")]
        public async Task<ActionResult> AssignIdentifier([FromBody] AssignIdentifierRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.EpcCode))
                {
                    return BadRequest(new { success = false, message = "EPC code is required" });
                }
                
                if (request.MattressId == Guid.Empty)
                {
                    return BadRequest(new { success = false, message = "Mattress ID is required" });
                }
                
                var result = await _identifierPoolRepository.MarkIdentifierAsAssignedAsync(request.EpcCode, request.MattressId);
                
                if (result)
                {
                    return Ok(new { success = true, message = "Identifier assigned successfully" });
                }
                else
                {
                    return NotFound(new { success = false, message = "Identifier not found or already assigned" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
} 
using Backend.DTOs.IdentifierPool;
using Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System.Text.Json;

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

        // GET: api/IdentifierPool
        [HttpGet]
        public async Task<IActionResult> GetIdentifiers([FromQuery] bool? assigned = null)
        {
            try
            {
                var identifiers = await _identifierPoolRepository.GetIdentifiersForOrgAsync(null, assigned);
                return Ok(new { success = true, data = identifiers });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // GET: api/IdentifierPool/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetIdentifierById(Guid id)
        {
            try
            {
                var identifier = await _identifierPoolRepository.GetIdentifierByIdAsync(id);
                
                if (identifier == null)
                    return NotFound(new { success = false, message = "Identifier not found" });
                
                return Ok(new { success = true, data = identifier });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // GET: api/IdentifierPool/epc/{epcCode}
        [HttpGet("epc/{epcCode}")]
        public async Task<IActionResult> GetIdentifierByEpcCode(string epcCode)
        {
            try
            {
                var identifier = await _identifierPoolRepository.GetIdentifierByEpcCodeAsync(epcCode);
                
                if (identifier == null)
                    return NotFound(new { success = false, message = "Identifier not found" });
                
                return Ok(new { success = true, data = identifier });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // POST: api/IdentifierPool/validate
        [HttpPost("validate")]
        public async Task<IActionResult> ValidateIdentifiers([FromBody] List<MattressIdentifierDto> identifiers)
        {
            try
            {
                if (identifiers == null || identifiers.Count == 0)
                    return BadRequest(new { success = false, message = "No identifiers provided" });

                var result = await _identifierPoolRepository.ValidateIdentifiersAsync(identifiers);
                return Ok(new { success = true, data = result });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // POST: api/IdentifierPool
        [HttpPost]
        public async Task<IActionResult> SaveIdentifiers([FromBody] List<MattressIdentifierDto> identifiers)
        {
            try
            {
                if (identifiers == null || identifiers.Count == 0)
                    return BadRequest(new { success = false, message = "No identifiers provided" });

                var result = await _identifierPoolRepository.SaveIdentifiersAsync(identifiers);
                return Ok(new { success = result, message = "Identifiers saved successfully" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Failed to save identifiers: {ex.Message}" });
            }
        }

        // POST: api/IdentifierPool/upload
        [HttpPost("upload")]
        public async Task<IActionResult> UploadExcelFile(IFormFile file)
        {
            Console.WriteLine($"API: Received file upload request");
            try
            {
                if (file == null)
                {
                    Console.WriteLine("API: File is null");
                    return BadRequest(new { success = false, message = "No file uploaded" });
                }
                
                if (file.Length == 0)
                {
                    Console.WriteLine("API: File has zero length");
                    return BadRequest(new { success = false, message = "Uploaded file is empty" });
                }
                
                // Log file details
                Console.WriteLine($"API: Processing file {file.FileName}, content type: {file.ContentType}, size: {file.Length} bytes");
                
                // Extract organization ID from token for logging
                var orgIdClaim = User.Claims.FirstOrDefault(c => c.Type == "OrgId")?.Value;
                if (!string.IsNullOrEmpty(orgIdClaim))
                {
                    Console.WriteLine($"API: Request from organization ID: {orgIdClaim}");
                }
                
                var startTime = DateTime.UtcNow;
                Console.WriteLine("API: Calling repository ProcessExcelFileAsync method");
                var result = await _identifierPoolRepository.ProcessExcelFileAsync(file);
                var duration = (DateTime.UtcNow - startTime).TotalSeconds;
                
                Console.WriteLine($"API: Excel processing completed in {duration:F2} seconds");
                Console.WriteLine($"API: Validation result - Total: {result.TotalCount}, Valid: {result.ValidCount}, Errors: {result.ErrorCount}");
                
                // Log the complete validation result that will be sent to frontend
                Console.WriteLine("API: Complete validation result being sent to frontend:");
                Console.WriteLine($"  Status: {result.Status}");
                Console.WriteLine($"  IsValid: {result.IsValid}");
                Console.WriteLine($"  TotalCount: {result.TotalCount}");
                Console.WriteLine($"  ValidCount: {result.ValidCount}");
                Console.WriteLine($"  WarningCount: {result.WarningCount}");
                Console.WriteLine($"  ErrorCount: {result.ErrorCount}");
                Console.WriteLine($"  ValidData count: {result.ValidData?.Count ?? 0}");
                Console.WriteLine($"  AllRows count: {result.AllRows?.Count ?? 0}");
                
                // Log sample of validation errors if any
                if (result.ErrorCount > 0 && result.AllRows != null)
                {
                    var errorRows = result.AllRows.Where(r => r.Status == "error").Take(3).ToList();
                    Console.WriteLine($"API: Sample of validation errors (showing up to 3):");
                    foreach (var row in errorRows)
                    {
                        Console.WriteLine($"  - Mattress ID: {row.MattressIdentifier}, EPC: {row.EpcCode}, Error: {row.Message}");
                    }
                }
                
                Console.WriteLine("API: Sending response to client - returning DTO directly without wrapping");
                // Return the validation result directly without wrapping it
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                // Log specific exceptions for file validation issues
                Console.WriteLine($"API: Argument validation error: {ex.Message}");
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log the full exception details
                Console.WriteLine($"API ERROR: Exception during Excel processing: {ex.Message}");
                Console.WriteLine($"API ERROR: Exception type: {ex.GetType().Name}");
                Console.WriteLine($"API ERROR: Stack trace: {ex.StackTrace}");
                
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"API ERROR: Inner exception: {ex.InnerException.Message}");
                    Console.WriteLine($"API ERROR: Inner exception type: {ex.InnerException.GetType().Name}");
                }
                
                return StatusCode(500, new { 
                    success = false, 
                    message = $"Failed to process Excel file: {ex.Message}", 
                    exceptionType = ex.GetType().Name,
                    details = ex.ToString() 
                });
            }
        }

        // POST: api/IdentifierPool/assign
        [HttpPost("assign")]
        public async Task<IActionResult> MarkIdentifierAsAssigned([FromBody] AssignIdentifierRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.EpcCode) || request.MattressId == Guid.Empty)
                    return BadRequest(new { success = false, message = "EPC code and mattress ID are required" });

                var result = await _identifierPoolRepository.MarkIdentifierAsAssignedAsync(request.EpcCode, request.MattressId);
                
                if (!result)
                    return NotFound(new { success = false, message = "Identifier not found or already assigned" });
                
                return Ok(new { success = true, message = "Identifier marked as assigned" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // DELETE: api/IdentifierPool/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIdentifier(Guid id)
        {
            try
            {
                var result = await _identifierPoolRepository.DeleteIdentifierAsync(id);
                
                if (!result)
                    return NotFound(new { success = false, message = "Identifier not found or already assigned" });
                
                return Ok(new { success = true, message = "Identifier deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // GET: api/IdentifierPool/next-available
        [HttpGet("next-available")]
        public async Task<IActionResult> GetNextAvailableIdentifier()
        {
            try
            {
                // Extract organization ID from token
                var orgIdClaim = User.Claims.FirstOrDefault(c => c.Type == "OrgId")?.Value;
                
                if (string.IsNullOrEmpty(orgIdClaim) || !Guid.TryParse(orgIdClaim, out Guid orgId))
                    return Unauthorized(new { success = false, message = "Organization ID not found in token" });

                var identifier = await _identifierPoolRepository.GetNextAvailableIdentifierAsync(orgId);
                
                if (identifier == null)
                    return NotFound(new { success = false, message = "No available identifiers found" });
                
                return Ok(new { success = true, data = identifier });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        // POST: api/IdentifierPool/bulk-save
        [HttpPost("bulk-save")]
        public async Task<IActionResult> SaveValidatedIdentifiers([FromBody] object rawData)
        {
            try
            {
                Console.WriteLine("API: Received bulk-save request");
                
                // Convert the raw JSON to a string for logging (limited to prevent excessive logging)
                var rawJson = JsonSerializer.Serialize(rawData);
                var truncatedJson = rawJson.Length > 500 
                    ? rawJson.Substring(0, 500) + "..." 
                    : rawJson;
                Console.WriteLine($"API: Raw JSON received: {truncatedJson}");
                
                // Try to deserialize the data as IdentifierValidationResultDto directly
                IdentifierValidationResultDto validationResult;
                try
                {
                    validationResult = JsonSerializer.Deserialize<IdentifierValidationResultDto>(rawJson);
                    Console.WriteLine("API: Successfully deserialized as IdentifierValidationResultDto");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"API: Failed to deserialize as IdentifierValidationResultDto: {ex.Message}");
                    
                    // Try to deserialize as a wrapper object with data property
                    try
                    {
                        var wrapper = JsonSerializer.Deserialize<Dictionary<string, object>>(rawJson);
                        if (wrapper.ContainsKey("data"))
                        {
                            var dataJson = JsonSerializer.Serialize(wrapper["data"]);
                            validationResult = JsonSerializer.Deserialize<IdentifierValidationResultDto>(dataJson);
                            Console.WriteLine("API: Successfully deserialized from wrapper.data property");
                        }
                        else
                        {
                            Console.WriteLine("API: No 'data' property found in wrapper");
                            return BadRequest(new { success = false, message = "Invalid data format - cannot find validation result" });
                        }
                    }
                    catch (Exception innerEx)
                    {
                        Console.WriteLine($"API: Failed to handle nested format: {innerEx.Message}");
                        return BadRequest(new { success = false, message = "Invalid data format" });
                    }
                }
                
                // Common validation code
                if (validationResult == null)
                {
                    Console.WriteLine("API: Validation result is null after deserialization");
                    return BadRequest(new { success = false, message = "Validation result cannot be null" });
                }
                
                Console.WriteLine($"API: Validation result details - IsValid: {validationResult.IsValid}, Status: {validationResult.Status}");
                Console.WriteLine($"API: ValidData is {(validationResult.ValidData == null ? "null" : "not null")}");
                
                if (validationResult.ValidData == null)
                {
                    Console.WriteLine("API: ValidData is null");
                    return BadRequest(new { success = false, message = "No valid data to save" });
                }
                
                Console.WriteLine($"API: ValidData count: {validationResult.ValidData.Count}");
                
                if (validationResult.ValidData.Count == 0)
                {
                    Console.WriteLine("API: ValidData is empty");
                    return BadRequest(new { success = false, message = "No valid identifiers to save" });
                }

        

                var result = await _identifierPoolRepository.SaveIdentifiersAsync(validationResult.ValidData);
                Console.WriteLine($"API: Successfully saved {validationResult.ValidData.Count} identifiers");
                return Ok(new { success = result, message = $"Successfully saved {validationResult.ValidData.Count} identifiers" });
            }
            catch (UnauthorizedAccessException ex)
            {
                Console.WriteLine($"API: Unauthorized exception: {ex.Message}");
                return Unauthorized(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API ERROR: Exception during save: {ex.Message}");
                Console.WriteLine($"API ERROR: Exception type: {ex.GetType().Name}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"API ERROR: Inner exception: {ex.InnerException.Message}");
                }
                return StatusCode(500, new { success = false, message = $"Failed to save identifiers: {ex.Message}" });
            }
        }

        // GET: api/IdentifierPool/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetIdentifierStats()
        {
            try
            {
                // Extract organization ID from token
                var orgIdClaim = User.Claims.FirstOrDefault(c => c.Type == "OrgId")?.Value;
                
                if (string.IsNullOrEmpty(orgIdClaim) || !Guid.TryParse(orgIdClaim, out Guid orgId))
                    return Unauthorized(new { success = false, message = "Organization ID not found in token" });

                var allIdentifiers = await _identifierPoolRepository.GetIdentifiersForOrgAsync(orgId);
                var assignedIdentifiers = allIdentifiers.FindAll(i => i.IsAssigned);
                var availableIdentifiers = allIdentifiers.FindAll(i => !i.IsAssigned);

                var stats = new
                {
                    TotalCount = allIdentifiers.Count,
                    AssignedCount = assignedIdentifiers.Count,
                    AvailableCount = availableIdentifiers.Count,
                    PercentAssigned = allIdentifiers.Count > 0 
                        ? Math.Round((double)assignedIdentifiers.Count / allIdentifiers.Count * 100, 2) 
                        : 0
                };
                
                return Ok(new { success = true, data = stats });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
    }
}
using Backend.Common.Utilities;
using Backend.DTOs.IdentifierPool;
using Backend.Repositories.Interfaces;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using OfficeOpenXml;
using OfficeOpenXml.Drawing;
using System.Drawing;
using System.Drawing.Imaging;

namespace Backend.Repositories.Implementations
{
    public class IdentifierPoolRepository : IIdentifierPoolRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JwtUtils _jwtUtils;

        public IdentifierPoolRepository(
            ApplicationDbContext context,
            IHttpContextAccessor httpContextAccessor,
            JwtUtils jwtUtils)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _jwtUtils = jwtUtils;
            
            // License is now set in Program.cs
        }

        public async Task<List<MattressIdentifierDto>> GetIdentifiersForOrgAsync(Guid? orgId = null, bool? assigned = null)
        {
            try
            {
                // If no org ID provided, get from token
                if (orgId == null)
                {
                    orgId = GetOrganisationIdFromToken();
                }

                // Build query
                var query = _context.MattressIdentifierPool.Where(i => i.OrgId == orgId);
                
                // Apply assigned filter if specified
                if (assigned.HasValue)
                {
                    query = query.Where(i => i.IsAssigned == assigned.Value);
                }

                // Execute query and map to DTOs
                var identifiers = await query
                    .Select(i => new MattressIdentifierDto
                    {
                        Id = i.Id.ToString(),
                        MattressIdentifier = i.MattressIdentifier,
                        EpcCode = i.EpcCode,
                        QrCodeBase64 = i.QrCodeBase64,
                        IsAssigned = i.IsAssigned,
                        CreatedDate = i.CreatedDate,
                        AssignedDate = i.AssignedDate,
                        AssignedToMattressId = i.AssignedToMattressId.HasValue ? i.AssignedToMattressId.Value.ToString() : null
                    })
                    .ToListAsync();

                return identifiers;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting identifiers: {ex.Message}");
                throw;
            }
        }

        public async Task<MattressIdentifierDto> GetIdentifierByIdAsync(Guid id)
        {
            try
            {
                var identifier = await _context.MattressIdentifierPool
                    .FirstOrDefaultAsync(i => i.Id == id);

                if (identifier == null)
                    return null;

                return new MattressIdentifierDto
                {
                    Id = identifier.Id.ToString(),
                    MattressIdentifier = identifier.MattressIdentifier,
                    EpcCode = identifier.EpcCode,
                    QrCodeBase64 = identifier.QrCodeBase64,
                    IsAssigned = identifier.IsAssigned,
                    CreatedDate = identifier.CreatedDate,
                    AssignedDate = identifier.AssignedDate,
                    AssignedToMattressId = identifier.AssignedToMattressId.HasValue ? identifier.AssignedToMattressId.Value.ToString() : null
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting identifier by ID: {ex.Message}");
                throw;
            }
        }

        public async Task<MattressIdentifierDto> GetIdentifierByEpcCodeAsync(string epcCode)
        {
            try
            {
                var identifier = await _context.MattressIdentifierPool
                    .FirstOrDefaultAsync(i => i.EpcCode == epcCode);

                if (identifier == null)
                    return null;

                return new MattressIdentifierDto
                {
                    Id = identifier.Id.ToString(),
                    MattressIdentifier = identifier.MattressIdentifier,
                    EpcCode = identifier.EpcCode,
                    QrCodeBase64 = identifier.QrCodeBase64,
                    IsAssigned = identifier.IsAssigned,
                    CreatedDate = identifier.CreatedDate,
                    AssignedDate = identifier.AssignedDate,
                    AssignedToMattressId = identifier.AssignedToMattressId.HasValue ? identifier.AssignedToMattressId.Value.ToString() : null
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting identifier by EPC code: {ex.Message}");
                throw;
            }
        }

        public async Task<IdentifierValidationResultDto> ValidateIdentifiersAsync(List<MattressIdentifierDto> identifiers)
        {
            Console.WriteLine($"Starting validation of {identifiers.Count} identifiers");
            
            var result = new IdentifierValidationResultDto
            {
                AllRows = new List<IdentifierValidationRowDto>(),
                ValidData = new List<MattressIdentifierDto>(),
                TotalCount = identifiers.Count,
                ValidCount = 0,
                WarningCount = 0,
                ErrorCount = 0
            };

            // Get organization ID from token
            Guid orgId = GetOrganisationIdFromToken();
            Console.WriteLine($"Validating for organization ID: {orgId}");

            // Get existing EPC codes to check for duplicates
            var existingEpcCodes = await _context.MattressIdentifierPool
                .Where(m => m.OrgId == orgId)
                .Select(m => m.EpcCode)
                .ToListAsync();
            Console.WriteLine($"Found {existingEpcCodes.Count} existing EPC codes in the pool");

            var existingMattressIds = await _context.MattressIdentifierPool
                .Where(m => m.OrgId == orgId)
                .Select(m => m.MattressIdentifier)
                .ToListAsync();
            Console.WriteLine($"Found {existingMattressIds.Count} existing mattress identifiers in the pool");

            // Also check EPC codes already assigned to mattresses
            var assignedEpcCodes = await _context.Mattresses
                .Where(m => m.OrgId == orgId && !string.IsNullOrEmpty(m.EpcCode))
                .Select(m => m.EpcCode)
                .ToListAsync();
            Console.WriteLine($"Found {assignedEpcCodes.Count} EPC codes already assigned to mattresses");

            int rowNumber = 0;
            foreach (var identifier in identifiers)
            {
                rowNumber++;
                Console.WriteLine($"Validating row {rowNumber}: MattressID={identifier.MattressIdentifier}, EPC={identifier.EpcCode}, HasQR={!string.IsNullOrEmpty(identifier.QrCodeBase64)}");
                
                var validationRow = new IdentifierValidationRowDto
                {
                    MattressIdentifier = identifier.MattressIdentifier,
                    EpcCode = identifier.EpcCode,
                    QrCodeBase64 = identifier.QrCodeBase64,
                    Status = "success",
                    Message = null
                };

                // Validation rules
                if (string.IsNullOrEmpty(identifier.EpcCode))
                {
                    validationRow.Status = "error";
                    validationRow.Message = "EPC code cannot be empty";
                    result.ErrorCount++;
                    Console.WriteLine($"  Error: EPC code is empty");
                }
                else if (existingEpcCodes.Contains(identifier.EpcCode) || assignedEpcCodes.Contains(identifier.EpcCode))
                {
                    validationRow.Status = "error";
                    validationRow.Message = "EPC code already exists in the system";
                    result.ErrorCount++;
                    Console.WriteLine($"  Error: EPC code '{identifier.EpcCode}' already exists");
                }
                else if (string.IsNullOrEmpty(identifier.MattressIdentifier))
                {
                    validationRow.Status = "error";
                    validationRow.Message = "Mattress identifier cannot be empty";
                    result.ErrorCount++;
                    Console.WriteLine($"  Error: Mattress identifier is empty");
                }
                else if (existingMattressIds.Contains(identifier.MattressIdentifier))
                {
                    validationRow.Status = "error";
                    validationRow.Message = "Mattress identifier already exists";
                    result.ErrorCount++;
                    Console.WriteLine($"  Error: Mattress identifier '{identifier.MattressIdentifier}' already exists");
                }
                else if (string.IsNullOrEmpty(identifier.QrCodeBase64))
                {
                    validationRow.Status = "error";
                    validationRow.Message = "QR code image is required";
                    result.ErrorCount++;
                    Console.WriteLine($"  Error: QR code image is missing");
                }
                else
                {
                    result.ValidCount++;
                    Console.WriteLine($"  Success: Identifier is valid");
                }

                result.AllRows.Add(validationRow);

                // Add to valid list if it's not an error
                if (validationRow.Status != "error")
                {
                    result.ValidData.Add(identifier);
                }
            }

            // Set overall status
            if (result.ErrorCount > 0)
                result.Status = "error";
            else if (result.WarningCount > 0)
                result.Status = "warning";
            else
                result.Status = "success";

            result.IsValid = result.ErrorCount == 0;
            
            Console.WriteLine($"Validation completed: {result.ValidCount} valid, {result.ErrorCount} errors, {result.WarningCount} warnings");
            
            // Log detailed information about the validation result
            Console.WriteLine("Validation result details:");
            Console.WriteLine($"  Status: {result.Status}");
            Console.WriteLine($"  IsValid: {result.IsValid}");
            Console.WriteLine($"  TotalCount: {result.TotalCount}");
            Console.WriteLine($"  ValidCount: {result.ValidCount}");
            Console.WriteLine($"  WarningCount: {result.WarningCount}");
            Console.WriteLine($"  ErrorCount: {result.ErrorCount}");
            Console.WriteLine($"  ValidData count: {result.ValidData?.Count ?? 0}");
            Console.WriteLine($"  AllRows count: {result.AllRows?.Count ?? 0}");
            
            // Log some samples of the valid and error rows
            if (result.ValidData?.Count > 0)
            {
                Console.WriteLine("Sample of valid identifiers:");
                foreach (var item in result.ValidData.Take(2))
                {
                    Console.WriteLine($"  - Mattress ID: {item.MattressIdentifier}, EPC: {item.EpcCode}, Has QR: {!string.IsNullOrEmpty(item.QrCodeBase64)}");
                }
            }
            
            if (result.ErrorCount > 0 && result.AllRows != null)
            {
                var errorRows = result.AllRows.Where(r => r.Status == "error").Take(2).ToList();
                Console.WriteLine("Sample of error rows:");
                foreach (var row in errorRows)
                {
                    Console.WriteLine($"  - Mattress ID: {row.MattressIdentifier}, EPC: {row.EpcCode}, Error: {row.Message}");
                }
            }

            return result;
        }

        public async Task<bool> SaveIdentifiersAsync(List<MattressIdentifierDto> identifiers)
        {
            try
            {
                // Get organization ID from token
                Guid orgId = GetOrganisationIdFromToken();

                // Begin transaction
                using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    foreach (var identifier in identifiers)
                    {
                        var newIdentifier = new MattressIdentifierPool
                        {
                            Id = Guid.NewGuid(),
                            OrgId = orgId,
                            EpcCode = identifier.EpcCode,
                            MattressIdentifier = identifier.MattressIdentifier,
                            QrCodeBase64 = identifier.QrCodeBase64,
                            IsAssigned = false,
                            CreatedDate = DateTime.UtcNow
                        };

                        await _context.MattressIdentifierPool.AddAsync(newIdentifier);
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine($"Error saving identifiers: {ex.Message}");
                    throw;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving identifiers: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> MarkIdentifierAsAssignedAsync(string epcCode, Guid mattressId)
        {
            try
            {
                var identifier = await _context.MattressIdentifierPool
                    .FirstOrDefaultAsync(i => i.EpcCode == epcCode && !i.IsAssigned);

                if (identifier == null)
                    return false;

                identifier.IsAssigned = true;
                identifier.AssignedDate = DateTime.UtcNow;
                identifier.AssignedToMattressId = mattressId;

                _context.MattressIdentifierPool.Update(identifier);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error marking identifier as assigned: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteIdentifierAsync(Guid id)
        {
            try
            {
                var identifier = await _context.MattressIdentifierPool.FindAsync(id);
                
                if (identifier == null)
                    return false;
                    
                if (identifier.IsAssigned)
                    return false; // Can't delete assigned identifiers
                
                _context.MattressIdentifierPool.Remove(identifier);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting identifier: {ex.Message}");
                throw;
            }
        }

        public async Task<MattressIdentifierDto> GetNextAvailableIdentifierAsync(Guid orgId)
        {
            try
            {
                var identifier = await _context.MattressIdentifierPool
                    .Where(i => i.OrgId == orgId && !i.IsAssigned)
                    .OrderBy(i => i.CreatedDate)
                    .FirstOrDefaultAsync();

                if (identifier == null)
                    return null;

                return new MattressIdentifierDto
                {
                    Id = identifier.Id.ToString(),
                    MattressIdentifier = identifier.MattressIdentifier,
                    EpcCode = identifier.EpcCode,
                    QrCodeBase64 = identifier.QrCodeBase64,
                    IsAssigned = identifier.IsAssigned,
                    CreatedDate = identifier.CreatedDate,
                    AssignedDate = identifier.AssignedDate,
                    AssignedToMattressId = identifier.AssignedToMattressId.HasValue ? identifier.AssignedToMattressId.Value.ToString() : null
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting next available identifier: {ex.Message}");
                throw;
            }
        }

        public async Task<IdentifierValidationResultDto> ProcessExcelFileAsync(IFormFile file)
        {
            Console.WriteLine($"Starting to process Excel file: {file.FileName}, Size: {file.Length} bytes");
            
            if (file == null || file.Length == 0)
            {
                Console.WriteLine("Error: File is empty or null");
                throw new ArgumentException("File is empty or null");
            }

            // Check file extension
            var extension = Path.GetExtension(file.FileName).ToLower();
            Console.WriteLine($"File extension: {extension}");
            
            if (extension != ".xlsx" && extension != ".xls")
            {
                Console.WriteLine($"Error: Invalid file extension: {extension}");
                throw new ArgumentException("Only Excel files (.xlsx or .xls) are allowed");
            }

            var identifiers = new List<MattressIdentifierDto>();

            using (var stream = new MemoryStream())
            {
                Console.WriteLine("Copying file to memory stream");
                await file.CopyToAsync(stream);
                
                try
                {
                    Console.WriteLine("Creating Excel package");
                    using (var package = new ExcelPackage(stream))
                    {
                        if (package.Workbook.Worksheets.Count == 0)
                        {
                            Console.WriteLine("Error: Excel file has no worksheets");
                            throw new ArgumentException("Excel file has no worksheets");
                        }
                        
                        var worksheet = package.Workbook.Worksheets[0]; // First worksheet
                        Console.WriteLine($"Using worksheet: {worksheet.Name}");
                        
                        if (worksheet.Dimension == null)
                        {
                            Console.WriteLine("Error: Worksheet is empty");
                            throw new ArgumentException("Worksheet is empty");
                        }
                        
                        int rowCount = worksheet.Dimension.Rows;
                        Console.WriteLine($"Worksheet has {rowCount} rows");
                        
                        if (rowCount < 2)
                        {
                            Console.WriteLine("Warning: Worksheet has less than 2 rows (no data rows)");
                        }

                        // First row is assumed to be headers, so start from row 2
                        for (int row = 2; row <= rowCount; row++)
                        {
                            Console.WriteLine($"Processing row {row}");
                            
                            // Extract mattress ID from first column
                            var mattressIdentifier = worksheet.Cells[row, 1].Value?.ToString();
                            Console.WriteLine($"  Column A: Mattress Identifier = {mattressIdentifier ?? "(empty)"}");
                            
                            // Extract EPC code from second column
                            var epcCode = worksheet.Cells[row, 2].Value?.ToString();
                            Console.WriteLine($"  Column B: EPC Code = {epcCode ?? "(empty)"}");
                            
                            // Extract QR code image (if it exists) from the cell
                            string qrCodeBase64 = null;
                            
                            // First, check if there's a text value in column 3 that might be a base64 string
                            var qrCodeCell = worksheet.Cells[row, 3].Value?.ToString();
                            if (!string.IsNullOrEmpty(qrCodeCell))
                            {
                                Console.WriteLine($"  Column C: Found text content, length: {qrCodeCell.Length}");
                                
                                // If it starts with "data:image" or seems like a base64 string, use it directly
                                if (qrCodeCell.StartsWith("data:image") || 
                                    (qrCodeCell.Length > 100 && qrCodeCell.All(c => char.IsLetterOrDigit(c) || c == '+' || c == '/' || c == '=')))
                                {
                                    // Ensure it has the proper prefix if it's just a raw base64 string
                                    qrCodeBase64 = qrCodeCell.StartsWith("data:image") 
                                        ? qrCodeCell 
                                        : $"data:image/png;base64,{qrCodeCell}";
                                    
                                    Console.WriteLine($"  Found QR code as text, using as base64");
                                }
                            }
                            
                            // If no base64 was found in the cell text, try to find embedded pictures
                            if (string.IsNullOrEmpty(qrCodeBase64))
                            {
                                var pictures = worksheet.Drawings.Where(d => d.From.Row == row - 1 && d.From.Column == 3).ToList();
                                Console.WriteLine($"  Found {pictures.Count} pictures in this cell");
                                
                                foreach (var pic in pictures)
                                {
                                    Console.WriteLine($"  Examining picture: {pic.Name}, Type: {pic.GetType().Name}");
                                    
                                    if (pic is ExcelPicture excelPicture)
                                    {
                                        if (excelPicture.Image != null)
                                        {
                                            Console.WriteLine($"  Found valid image in cell, size: {excelPicture.Image.ImageBytes.Length} bytes");
                                            try
                                            {
                                                // Convert the ExcelPicture to a standard .NET Image
                                                using (var image = Image.FromStream(new MemoryStream(excelPicture.Image.ImageBytes)))
                                                {
                                                    Console.WriteLine($"  Converted to Image, size: {image.Width}x{image.Height}, format: {image.RawFormat}");
                                                    
                                                    using (var imageStream = new MemoryStream())
                                                    {
                                                        image.Save(imageStream, ImageFormat.Png);
                                                        byte[] imageBytes = imageStream.ToArray();
                                                        string base64String = Convert.ToBase64String(imageBytes);
                                                        qrCodeBase64 = $"data:image/png;base64,{base64String}";
                                                        Console.WriteLine($"  Converted to base64 string, length: {base64String.Length} chars");
                                                        
                                                        // Log a prefix of the base64 string for verification
                                                        if (base64String.Length > 0)
                                                        {
                                                            var prefix = base64String.Substring(0, Math.Min(20, base64String.Length));
                                                            Console.WriteLine($"  Base64 prefix: {prefix}...");
                                                        }
                                                    }
                                                }
                                            }
                                            catch (Exception ex)
                                            {
                                                Console.WriteLine($"  Error processing image: {ex.Message}");
                                            }
                                        }
                                        else
                                        {
                                            Console.WriteLine("  ExcelPicture found but Image property is null");
                                        }
                                    }
                                }
                            }
                            
                            // Log whether a QR code was found by any method
                            Console.WriteLine($"  QR code found: {!string.IsNullOrEmpty(qrCodeBase64)}");

                            // Skip empty rows
                            if (string.IsNullOrEmpty(mattressIdentifier) && string.IsNullOrEmpty(epcCode))
                            {
                                Console.WriteLine("  Skipping empty row");
                                continue;
                            }

                            // Add to list of identifiers to process
                            identifiers.Add(new MattressIdentifierDto
                            {
                                MattressIdentifier = mattressIdentifier,
                                EpcCode = epcCode,
                                QrCodeBase64 = qrCodeBase64,
                                IsAssigned = false,
                                CreatedDate = DateTime.UtcNow
                            });
                            Console.WriteLine("  Added to identifiers list");
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error processing Excel file: {ex.Message}");
                    Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    throw new ArgumentException($"Error processing Excel file: {ex.Message}", ex);
                }
            }

            Console.WriteLine($"Extracted {identifiers.Count} identifiers from Excel file, proceeding to validation");
            
            // Validate the extracted identifiers
            return await ValidateIdentifiersAsync(identifiers);
        }

        private string GetContentType(ImageFormat format)
        {
            if (format.Equals(ImageFormat.Jpeg)) return "image/jpeg";
            if (format.Equals(ImageFormat.Png)) return "image/png";
            if (format.Equals(ImageFormat.Gif)) return "image/gif";
            if (format.Equals(ImageFormat.Bmp)) return "image/bmp";
            if (format.Equals(ImageFormat.Tiff)) return "image/tiff";
            return "application/octet-stream"; // Default
        }

        private Guid GetOrganisationIdFromToken()
        {
            try
            {
                var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
                    .FirstOrDefault()?
                    .Replace("Bearer ", string.Empty);

                if (string.IsNullOrEmpty(token))
                    throw new UnauthorizedAccessException("No authorization token provided");

                var (principal, error) = _jwtUtils.ValidateToken(token);

                if (principal == null || !string.IsNullOrEmpty(error))
                    throw new UnauthorizedAccessException($"Invalid token: {error}");

                var orgIdClaim = principal.Claims.FirstOrDefault(c => c.Type == "OrgId")?.Value;

                if (string.IsNullOrEmpty(orgIdClaim) || !Guid.TryParse(orgIdClaim, out Guid orgId))
                    throw new UnauthorizedAccessException("Organization ID not found in token");

                return orgId;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error extracting organization ID from token: {ex.Message}");
                throw;
            }
        }
    }
}
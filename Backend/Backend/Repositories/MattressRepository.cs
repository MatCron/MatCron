using Backend.Common.Constants;
using Backend.Common.Converters;
using Backend.Common.Enums;
using Backend.Common.Utilities;
using Backend.DTOs.Mattress;
using Backend.Repositories.Interfaces;
using MatCron.Backend.Common;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Backend.Repositories
{
    public class MattressRepository : IMattressRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JwtUtils _jwtUtils;
        private readonly ILogRepository _logRepository;
        public MattressRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IConfiguration config , ILogRepository log)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _jwtUtils = new JwtUtils(config);
            _logRepository = log;
        }

        public async Task<IEnumerable<MattressImportedDto>> GetAllMattressesAsync()
        {
            try
            {
                var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
                    .FirstOrDefault()?
                    .Replace("Bearer ", string.Empty);

                var (principals, error) = _jwtUtils.ValidateToken(token);

                // Extract the organisation ID from the token claims
                Guid organisationId = Guid.Parse(principals?.Claims.FirstOrDefault(c => c.Type == "OrgId")?.Value);

                // Confirm that the organisation exists
                Organisation organisation = await _context.Organisations.FindAsync(organisationId);
                if (organisation == null)
                {
                    throw new Exception("Organisation not found. Check token or database.");
                }

                // Filter by OrgId and then include the MattressType
                var mattresses = await _context.Mattresses
                    .Where(m => m.OrgId == organisation.Id) // ← Ensure we only fetch from the current organization
                    .Include(m => m.MattressType)
                    .Select(m => new
                    {
                        m.Uid,
                        m.Location,
                        m.DaysToRotate,
                        m.Status,
                        m.LifeCyclesEnd,
                        MattressTypeName = m.MattressType.Name
                    })
                    .ToListAsync();

                var result = mattresses.Select(m => new MattressImportedDto
                {
                    id = m.Uid.ToString(),
                    type = m.MattressTypeName, // Handle missing types gracefully
                    location = m.Location ?? "N/A",
                    status = (byte)m.Status,
                    DaysToRotate = m.DaysToRotate,
                    LifeCyclesEnd = m.LifeCyclesEnd,
                    organisation = "Matcron"
                }).ToList();

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllMattressesAsync: {ex.Message}");
                throw;
            }
        }




        public async Task<MattressDetailedDto> GetMattressByIdAsync(string id)
        {
            try
            {
                Mattress result = await _context.Mattresses.FindAsync(Guid.Parse(id));
                if (result == null)
                {
                    throw new Exception("Mattress not found");
                }
                
                Organisation organisation = null;

                if(result.OrgId == null)
                {
                    organisation = await _context.Organisations.FindAsync(result.OrgId);
                }

                MattressType mattressType = await _context.MattressTypes.FindAsync(result.MattressTypeId);
                return new MattressDetailedDto
                {
                    Uid = result.Uid.ToString(),
                    BatchNo = result.BatchNo,
                    ProductionDate = result.ProductionDate,
                    Org = organisation == null ? null  : OrganisationConverter.EntityToDto(organisation),
                    MattressType = MattressTypeConverter.ConvertToDto(mattressType),
                    EpcCode = result.EpcCode,
                    Status = result.Status,
                    LifeCyclesEnd = result.LifeCyclesEnd,
                    DaysToRotate = result.DaysToRotate,
                    Location = result.Location
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetMattressByIdAsync: {ex.Message}");
                throw;
            }
        }

    public async Task<MattressDto> AddMattressAsync(MattressDto dto)
    {
        try
        {
            // Extract token from HTTP header
            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
                .FirstOrDefault()?
                .Replace("Bearer ", string.Empty);

            // Validate the token and extract principals
            var (principals, error) = _jwtUtils.ValidateToken(token);
            if (!string.IsNullOrWhiteSpace(error))
            {
                throw new Exception($"Token validation error: {error}");
            }

            // Retrieve the OrgId from the token claims
            Guid organisationId = Guid.Parse(
                principals?.Claims.FirstOrDefault(c => c.Type == "OrgId")?.Value
            );

            // Verify the organisation exists in the database
            Organisation org = await _context.Organisations.FindAsync(organisationId);
            if (org == null)
            {
                throw new Exception("Organisation not found. Check the token or database.");
            }

            // Verify that the mattress type ID in DTO is valid
            if (string.IsNullOrWhiteSpace(dto.MattressTypeId))
            {
                throw new Exception("Mattress type ID not provided");
            }
            Guid mattressTypeIdGuid = Guid.Parse(dto.MattressTypeId);
            MattressType mattressType = await _context.MattressTypes.FindAsync(mattressTypeIdGuid);
            if (mattressType == null)
            {
                throw new Exception("Mattress type not found");
            }

                // Create new Mattress and set OrgId from the token
                Mattress mattress = new Mattress
                {
                    Uid = Guid.NewGuid(),
                    BatchNo = dto.BatchNo ?? throw new Exception("Batch number not found"),
                    ProductionDate = DateTime.Today,
                    MattressTypeId = mattressTypeIdGuid,
                    OrgId = organisationId,          // <-- Assign the OrgId here
                    Location = dto.location ?? "",
                    EpcCode = dto.EpcCode ?? "",
                    Status = (byte)(dto.Status ?? 0),
                    LifeCyclesEnd = dto.LifeCyclesEnd,
                    DaysToRotate = dto.DaysToRotate ?? (int) mattressType.RotationInterval
                };

            // Add and save the new mattress
            _context.Mattresses.Add(mattress);
            await _context.SaveChangesAsync();

            // Increase the stock for the corresponding mattress type
            mattressType.Stock++;
            _context.MattressTypes.Update(mattressType);
            await _context.SaveChangesAsync();
            var settings = new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore, // Ignore circular references
                Formatting = Formatting.Indented
            };

            MattressDto result = MattressConverter.ConvertToDto(mattress);
            var temp = new {Detail="New Mattress Created", result, TimeStamp=DateTime.Now };
            string jsonString = JsonConvert.SerializeObject(temp,settings);
            var logResult = await _logRepository.AddLogMattress(new LogMattress
            {
                Id = Guid.NewGuid(),
                ObjectId = mattress.Uid,
                Status = (byte) LogStatus.newlyCreated,
                Details = jsonString,
                Type = ((byte)LogType.mattress),
                TimeStamp = DateTime.Now
            });


            if (logResult == null)
            {
                throw new Exception("Error adding log");
            }

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in AddMattressAsync: {ex.Message}");
            throw;
        }
    }


        public async Task<MattressDto> EditMattressAsync(string id, MattressDto dto)
        {
            try
            {
                Mattress result = await _context.Mattresses.FindAsync(Guid.Parse(id));
                if (result == null)
                {
                    throw new Exception("Mattress not found");
                }

                if(result.Status != dto.Status && dto.Status != null)
                {
                    var tmp = new { Detail = "Updated Mattress Status",
                                    Original=result.Status,
                                    New=dto.Status,
                                    TimeStamp = DateTime.Now };
                    string JsonString = JsonConvert.SerializeObject(tmp, BaseConstant.jsonSettings);
                    var log = await _logRepository.AddLogMattress(new LogMattress
                    {
                        Id = Guid.NewGuid(),
                        ObjectId = result.Uid,
                        Status = (byte)LogStatus.statusChanged,
                        Details = JsonString,
                        Type = ((byte)LogType.mattress),
                        TimeStamp = DateTime.Now
                    });

                    if (log == null)
                    {
                        throw new Exception("Error adding log");
                    }
                }
                result.Status = (byte)(dto.Status ?? result.Status);

                if (result.Location != dto.location && dto.location != null)
                {
                    var tmp = new { Detail = "Updated Mattress Location",
                                    Original=result.Location,
                                    New=dto.location,
                                    TimeStamp = DateTime.Now };

                    string JsonString = JsonConvert.SerializeObject(tmp, BaseConstant.jsonSettings);
                    var log = await _logRepository.AddLogMattress(new LogMattress
                    {
                        Id = Guid.NewGuid(),
                        ObjectId = result.Uid,
                        Status = (byte)LogStatus.changedLocation,
                        Details = JsonString,
                        Type = ((byte)LogType.mattress),
                        TimeStamp = DateTime.Now
                    });

                    if (log == null)
                    {
                        throw new Exception("Error adding log");
                    }
                }

                result.Status =(byte) (dto.Status ?? result.Status);
                
                result.Location = dto.location ?? result.Location;

                if (dto.MattressTypeId != null)
                {
                    MattressType type = await _context.MattressTypes.FindAsync(Guid.Parse(dto.MattressTypeId));
                    if (type == null)
                    {
                        throw new Exception("Mattress type not found");
                    }
                    result.MattressTypeId = Guid.Parse(dto.MattressTypeId);
                }
                if(dto.Status==3)
                {
                    result.RotationTimer = DateTime.Now.AddDays(result.DaysToRotate);
                }

                if(dto.LatestDateRotate != null )
                {
                    result.LatestDateRotate = dto.LatestDateRotate;
                    var temp = new
                    {
                        Detail = "Mattress Rotated",
                        TimeStamp = DateTime.Now
                    };

                    string jsonString = JsonConvert.SerializeObject(temp, BaseConstant.jsonSettings);

                    var logResult = await _logRepository.AddLogMattress(new LogMattress
                    {
                        Id = Guid.NewGuid(),
                        ObjectId = result.Uid,
                        Status = (byte)LogStatus.rotated,
                        Details = jsonString,
                        Type = ((byte)LogType.mattress),
                        TimeStamp = DateTime.Now
                    });

                    if (logResult == null)
                    {
                        throw new Exception("Error adding log");
                    }
                }

                _context.Mattresses.Update(result);
                await _context.SaveChangesAsync();

                return MattressConverter.ConvertToDto(result);

            }
            
            catch (Exception ex)
            {
                Console.WriteLine($"Error in EditMattressAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteMattressAsync(string id)
        {
            try
            {
                Mattress result = await _context.Mattresses.FindAsync(Guid.Parse(id));
                
                if (result == null)
                {
                    throw new Exception("Mattress not found");
                }

                MattressType mattressType = await _context.MattressTypes.FindAsync(result.MattressTypeId);
                if (mattressType == null)
                {
                    throw new Exception("Mattress type not found");
                }

                mattressType.Stock--;
                _context.MattressTypes.Update(mattressType);
                await _context.SaveChangesAsync();

                _context.Mattresses.Remove(result);
                await _context.SaveChangesAsync();

                                
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteMattressAsync: {ex.Message}");
                throw;
            }
        }

    }
}

//
//
// public async Task<MattressDto> AddMattressAsync(MattressDto dto)
// {
//     try
//     {
//         // Get token and validate
//         var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
//             .FirstOrDefault()?
//             .Replace("Bearer ", string.Empty);
//
//         var (principals, error) = _jwtUtils.ValidateToken(token);
//
//         // Extract the organisation ID from the token claims
//         Guid organisationId = Guid.Parse(principals?.Claims.FirstOrDefault(c => c.Type == "OrgId")?.Value);
//
//         // Validate mattress type
//         Guid mattressTypeIdGuid;
//         if (!Guid.TryParse(dto.MattressTypeId, out mattressTypeIdGuid))
//         {
//             throw new Exception("Invalid MattressTypeId format. Must be a valid GUID.");
//         }
//
//         var mattressType = await _context.MattressTypes.FindAsync(mattressTypeIdGuid);
//         if (mattressType == null)
//         {
//             throw new Exception($"MattressType with ID {dto.MattressTypeId} not found.");
//         }
//
//         // Check if EPC code is provided in the DTO
//         string epcCode = dto.EpcCode;
//         
//         if (string.IsNullOrEmpty(epcCode))
//         {
//             // If no EPC code provided, get one from the pool
//             var availableIdentifier = await _context.MattressIdentifierPool
//                 .Where(i => i.OrgId == organisationId && !i.IsAssigned)
//                 .OrderBy(i => i.CreatedDate)
//                 .FirstOrDefaultAsync();
//
//             if (availableIdentifier == null)
//             {
//                 throw new Exception("No available identifiers in the pool. Please upload more identifiers.");
//             }
//             
//             epcCode = availableIdentifier.EpcCode;
//             availableIdentifier.IsAssigned = true;
//             availableIdentifier.AssignedDate = DateTime.UtcNow;
//             _context.MattressIdentifierPool.Update(availableIdentifier);
//         }
//         else
//         {
//             // Verify the provided EPC code is valid and available
//             var poolIdentifier = await _context.MattressIdentifierPool
//                 .FirstOrDefaultAsync(i => i.EpcCode == epcCode && i.OrgId == organisationId && !i.IsAssigned);
//                 
//             if (poolIdentifier == null)
//             {
//                 throw new Exception("The provided EPC code is not available or doesn't belong to your organization.");
//             }
//             
//             // Mark it as assigned
//             poolIdentifier.IsAssigned = true;
//             poolIdentifier.AssignedDate = DateTime.UtcNow;
//             _context.MattressIdentifierPool.Update(poolIdentifier);
//         }
//
//         // Create new Mattress with the EPC code
//         Mattress mattress = new Mattress
//         {
//             Uid = Guid.NewGuid(),
//             BatchNo = dto.BatchNo ?? throw new Exception("Batch number not found"),
//             ProductionDate = DateTime.Today,
//             MattressTypeId = mattressTypeIdGuid,
//             OrgId = organisationId,
//             Location = dto.location ?? "",
//             EpcCode = epcCode,
//             Status = (byte)(dto.Status ?? 0),
//             LifeCyclesEnd = dto.LifeCyclesEnd,
//             DaysToRotate = dto.DaysToRotate ?? (int)mattressType.RotationInterval
//         };
//
//         // Add and save the new mattress
//         _context.Mattresses.Add(mattress);
//         
//         // Update the pool identifier to reference this mattress
//         var identifier = await _context.MattressIdentifierPool
//             .FirstOrDefaultAsync(i => i.EpcCode == epcCode && i.OrgId == organisationId);
//         
//         if (identifier != null)
//         {
//             identifier.AssignedToMattressId = mattress.Uid;
//             _context.MattressIdentifierPool.Update(identifier);
//         }
//         
//         await _context.SaveChangesAsync();
//
//         // Rest of your code for stock update, logging, etc.
//         mattressType.Stock++;
//         _context.MattressTypes.Update(mattressType);
//         await _context.SaveChangesAsync();
//         
//         // Your existing logging code
//         var settings = new JsonSerializerSettings
//         {
//             ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
//             Formatting = Formatting.Indented
//         };
//
//         MattressDto result = MattressConverter.ConvertToDto(mattress);
//         var temp = new {Detail="New Mattress Created", result, TimeStamp=DateTime.Now };
//         string jsonString = JsonConvert.SerializeObject(temp,settings);
//         var logResult = await _logRepository.AddLogMattress(new LogMattress
//         {
//             Id = Guid.NewGuid(),
//             ObjectId = mattress.Uid,
//             Status = (byte) LogStatus.newlyCreated,
//             Details = jsonString,
//             Type = ((byte)LogType.mattress),
//             TimeStamp = DateTime.Now
//         });
//
//         return result;
//     }
//     catch (Exception ex)
//     {
//         Console.WriteLine($"Error in AddMattressAsync: {ex.Message}");
//         throw;
//     }
// }
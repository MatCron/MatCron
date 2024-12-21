using Backend.Common.Converters;
using Backend.DTOs.Mattress;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class MattressRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly OrganisationRepository _organisationRepository;
        public MattressRepository(ApplicationDbContext context, OrganisationRepository organisationRepository)
        {
            _context = context;
            _organisationRepository = organisationRepository;
        }

        public async Task<IEnumerable<MattressDto>> GetAllMattressesAsync()
        {
            try
            {
                var result = await _context.Mattresses.AsNoTracking().ToListAsync();
                return result.Select(m => new MattressDto
                {
                    Uid = m.Uid.ToString(),
                    BatchNo = m.BatchNo,
                    ProductionDate = m.ProductionDate,
                    MattressTypeId = m.MattressTypeId.ToString(),
                    OrgId = m.OrgId.ToString(),
                    EpcCode = m.EpcCode,
                    Status = m.Status,
                    LifeCyclesEnd = m.LifeCyclesEnd,
                    DaysToRotate = m.DaysToRotate

                }).ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllMattressesAsync: {ex.Message}");
                throw;
            }
        }


        public async Task<MattressDto> GetMattressByIdAsync(string id)
        {
            try
            {
                Mattress result = await _context.Mattresses.FindAsync(Guid.Parse(id));
                if (result == null)
                {
                    throw new Exception("Mattress not found");
                }
                return new MattressDto
                {
                    Uid = result.Uid.ToString(),
                    BatchNo = result.BatchNo,
                    ProductionDate = result.ProductionDate,
                    MattressTypeId = result.MattressTypeId.ToString(),
                    OrgId = result.OrgId.ToString(),
                    EpcCode = result.EpcCode,
                    Status = result.Status,
                    LifeCyclesEnd = result.LifeCyclesEnd,
                    DaysToRotate = result.DaysToRotate
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
                MattressType mattressType = await _context.MattressTypes.FindAsync(Guid.Parse(dto.MattressTypeId));
                if(mattressType == null)
                {
                    throw new Exception("Mattress type not found");
                }


                Organisation org = await _context.Organisations.FindAsync(Guid.Parse(dto.OrgId));
                if (org == null)
                {
                    throw new Exception("Organisation not found");
                }

                Mattress mattress = new Mattress
                {
                    Uid = Guid.NewGuid(),
                    BatchNo = dto.BatchNo ?? throw new Exception("batch number not found"),
                    ProductionDate = dto.ProductionDate != null ? dto.ProductionDate : throw new Exception("Production date not found"),
                    MattressTypeId = dto.MattressTypeId != null? Guid.Parse(dto.MattressTypeId): throw new Exception("mattress type id not found"),
                    OrgId = dto.OrgId != null ? Guid.Parse(dto.OrgId) : throw new Exception("org id not found"),
                    EpcCode = dto.EpcCode ?? "",
                    Status = dto.Status ?? 1,
                    LifeCyclesEnd = dto.LifeCyclesEnd,
                    DaysToRotate = dto.DaysToRotate ?? 0
                };
                _context.Mattresses.Add(mattress);
                await _context.SaveChangesAsync();

                mattressType.Stock++;
                _context.MattressTypes.Update(mattressType);
                await _context.SaveChangesAsync();

                MattressDto result = MattressConverter.ConvertToDto(mattress);
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
                result.Status = dto.Status?? result.Status;
                result.LifeCyclesEnd = dto.LifeCyclesEnd ?? result.LifeCyclesEnd;
                result.DaysToRotate = dto.DaysToRotate ?? result.DaysToRotate;

                if (dto.MattressTypeId != null)
                {
                    MattressType type = await _context.MattressTypes.FindAsync(Guid.Parse(dto.MattressTypeId));
                    if (type == null)
                    {
                        throw new Exception("Mattress type not found");
                    }
                    result.MattressTypeId = Guid.Parse(dto.MattressTypeId);
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

        public async Task<string> DeleteMattressAsync(string id)
        {
            try
            {
                Mattress result = await _context.Mattresses.FindAsync(Guid.Parse(id));
                
                if (result == null)
                {
                    return "Mattress not found";
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

                                
                return "Mattress deleted successfully";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteMattressAsync: {ex.Message}");
                throw;
            }
        }

    }
}

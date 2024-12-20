using Backend.Data;
using Backend.DTOs.Mattress;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories
{
    public class MattressRepository
    {
        private readonly ApplicationDbContext _context;

        public MattressRepository(ApplicationDbContext context)
        {
            _context = context;
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
                    GroupId = m.GroupId.ToString(),
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

        //public async Task<List<MattressDetailedDto>> GetMattressDetailedAsync()
        //{
        //    try
        //    {

        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error in GetMattressSummariesAsync: {ex.Message}");
        //        throw;
        //    }
        //}

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
                    GroupId = result.GroupId.ToString(),
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
                Mattress mattress = new Mattress
                {
                    Uid = Guid.NewGuid(),
                    BatchNo = dto.BatchNo ?? throw new ,
                    ProductionDate = dto.ProductionDate,
                    MattressTypeId = Guid.Parse(dto.MattressTypeId),
                    GroupId = Guid.Parse(dto.GroupId),
                    OrgId = Guid.Parse(dto.OrgId),
                    EpcCode = dto.EpcCode,
                    Status = dto.Status,
                    LifeCyclesEnd = dto.LifeCyclesEnd,
                    DaysToRotate = dto.DaysToRotate
                };
                _context.Mattresses.Add(mattress);
                await _context.SaveChangesAsync();
                return dto;
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
                result.Status = dto.Status != null ? dto.Status : result.Status;
                result.LifeCyclesEnd = dto.LifeCyclesEnd ?? result.LifeCyclesEnd;
                result.DaysToRotate = dto.DaysToRotate != null ? dto.DaysToRotate : result.DaysToRotate;


                _context.Entry(result).CurrentValues.SetValues(dto);
                await _context.SaveChangesAsync();


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

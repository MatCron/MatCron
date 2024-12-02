using System.Threading.Tasks;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;

namespace MatCron.Backend.Repositories.Interfaces
{
    public interface IMattressTypeRepository
    {
        Task<IEnumerable<MattressType>> GetAllMattressTypesAsync();
        Task<IEnumerable<MattressTypeTileDTO>> GetMattressTypeSummariesAsync();
        Task<MattressTypeDTO?> GetMattressTypeByIdAsync(Guid id);
        Task<string> AddMattressTypeAsync(MattressTypeDTO mattressTypeDto); 
        Task<string> EditMattressTypeAsync(MattressTypeDTO mattressTypeDto);
        Task<string> DeleteMattressTypeAsync(Guid mattressTypeId);
    }
}
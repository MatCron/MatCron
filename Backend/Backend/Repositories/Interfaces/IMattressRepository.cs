using Backend.DTOs.Mattress;
using MatCron.Backend.Entities;

namespace Backend.Repositories.Interfaces
{
    public interface IMattressRepository
    {
        Task<IEnumerable<MattressDto>> GetAllMattressesAsync();
        Task<MattressDto> GetMattressByIdAsync(string id);
        Task<MattressDto> AddMattressAsync(MattressDto dto);
        Task<MattressDto> EditMattressAsync(string id,MattressDto dto);
        Task<bool> DeleteMattressAsync(string id);
    }
}

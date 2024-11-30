using System.Threading.Tasks;
using MatCron.Backend.Entities;

namespace MatCron.Backend.Repositories.Interfaces
{
    public interface IMattressTypeRepository
    {
        Task<IEnumerable<MattressType>> GetAllMattressTypesAsync();
    }
}
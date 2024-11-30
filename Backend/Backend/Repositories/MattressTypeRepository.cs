using MatCron.Backend.Repositories.Interfaces;
using Backend.Data;

namespace MatCron.Backend.Repositories.Implementations
{
    public class MattressTypeRepository : IMattressTypeRepository
    {
        private readonly ApplicationDbContext _context;

        public MattressTypeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Placeholder for repository methods
    }
}
//using Backend.Common.Utilities;
//using Backend.DTOs.Mattress;
//using Backend.DTOs.Notification;
//using Backend.Entities;
//using Backend.Repositories.Interfaces;
//using MatCron.Backend.Data;
//using MatCron.Backend.Entities;
//using Microsoft.EntityFrameworkCore;

//namespace Backend.Repositories
//{
//    public class NotificationRepository:INotificationRepository
//    {
//        private readonly ApplicationDbContext _context;
//        private readonly IHttpContextAccessor _httpContextAccessor;
//        private readonly JwtUtils _jwtUtils;
//        public NotificationRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IConfiguration config)
//        {
//            _context = context;
//            _httpContextAccessor = httpContextAccessor;
//            _jwtUtils = new JwtUtils(config);
//        }

//        public async Task<List<NotificationDTO>> GetAllGetAllNotificatoin()
//        {
//            try
//            {
//                var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
//                    .FirstOrDefault()?
//                    .Replace("Bearer ", string.Empty);

//                var (principals, error) = _jwtUtils.ValidateToken(token);

//                // Extract the organisation ID from the token claims
//                Guid organisationId = Guid.Parse(principals?.Claims.FirstOrDefault(c => c.Type == "OrgId")?.Value);

//                // Confirm that the organisation exists
//                Organisation organisation = await _context.Organisations.FindAsync(organisationId);
//                if (organisation == null)
//                {
//                    throw new Exception("Organisation not found. Check token or database.");
//                }
                
//            }

//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error in GetAllNotification: {ex.Message}");
//                throw;
//            }
//        }
//        public async Task<bool> CheckRotationNotification(String Id)
//        {
//            var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
//                    .FirstOrDefault()?
//                    .Replace("Bearer ", string.Empty);

//            var (principals, error) = _jwtUtils.ValidateToken(token);

//            // Extract the organisation ID from the token claims
//            Guid organisationId = Guid.Parse(principals?.Claims.FirstOrDefault(c => c.Type == "OrgId")?.Value);

//            // Confirm that the organisation exists
//            Organisation organisation = await _context.Organisations.FindAsync(organisationId);
//            if (organisation == null)
//            {
//                throw new Exception("Organisation not found. Check token or database.");
//            }
//            var mattresses = await _context.Mattresses
//                    .Where(m => m.OrgId == organisation.Id) // ← Ensure we only fetch from the current organization
//                    .Include(m => m.MattressType)
//                    .Select(m => new
//                    {
//                        m.Uid,
//                        m.Location,
//                        m.DaysToRotate,
//                        m.Status,
//                        m.LifeCyclesEnd,
//                        m.LatestDateRotate,
//                        MattressTypeName = m.MattressType.Name
//                    })
//                    .ToListAsync();
//            List<Notification> newNotification = new List<Notification>();
//            bool flag = false;
//            foreach (var mat in mattresses)
//            {
//                if (mat.Status == 3 && mat.LatestDateRotate <= DateTime.Now)
//                {
//                    Notification notification = new Notification
//                    {
//                        Id = Guid.NewGuid(),  // Generating a new unique identifier
//                        Message = $"Mattress with ID {mat.Uid} needs rotation.",
//                        Status = 1, // Assuming '1' means an active notification
//                        CreatedAt = DateOnly.FromDateTime(DateTime.Now), // Convert DateTime to DateOnly
//                        UpdatedAt = DateOnly.FromDateTime(DateTime.Now),
//                        NotificationType =  // Assign an appropriate NotificationType object
//                    };
//                }
//            }
//        }






//        public Task<bool> DeleteNotificatoin(string NotificationId)
//        {

//        }
//    }
//}

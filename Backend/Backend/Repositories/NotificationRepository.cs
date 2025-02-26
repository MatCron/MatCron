
using System.Diagnostics.Eventing.Reader;
using Backend.Common.Converters;
using Backend.Common.Enums;
using Backend.Common.Utilities;
using Backend.DTOs.Mattress;
using Backend.DTOs.Notification;
using Backend.DTOs.User;
using Backend.Entities;
using Backend.Repositories.Interfaces;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace Backend.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JwtUtils _jwtUtils;
        public NotificationRepository(ApplicationDbContext context, IHttpContextAccessor httpContextAccessor, IConfiguration config)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _jwtUtils = new JwtUtils(config);
        }

        public async Task<List<UserNotificationDTO>> GetAllGetAllNotificatoin(Guid UserId)
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
                User user = await _context.Users.FindAsync(UserId);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                var userNotifications = await _context.UserNotifications
                    .Where(n => n.User == user)
                    .Select(n => new UserNotification
                    {
                        Id = Guid.NewGuid(),
                        Notification = n.Notification,
                        ReadAt = n.ReadAt,
                        ReadStatus = n.ReadStatus

                    })
                        .ToListAsync();
                return userNotifications.Select(n => new UserNotificationDTO
                {
                    Id = n.Id.ToString(),
                    NotificationMessaage = n.Notification.Message,
                    ReadAt = n.ReadAt,
                    ReadStatus = n.ReadStatus
                }).ToList();

            }



            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAllNotification: {ex.Message}");
                throw;
            }
        }
        public async Task<bool> CheckRotationNotification()
        {
            try
            {
                //check the organisation
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
                //get all the matress of the organization
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
                            m.LatestDateRotate,
                            MattressTypeName = m.MattressType.Name
                        })
                        .ToListAsync();
                //create org wide notification for mattresses that need rotation

                var notificationsToAdd = mattresses
                .Where(m => m.Status == 3 && m.LatestDateRotate.HasValue &&  m.LatestDateRotate.Value <= DateTime.UtcNow)
                .Select(m => new Notification
                {
                    Id = Guid.NewGuid(),
                    Message = $"Mattress with ID {m.Uid} needs rotation.",
                    Status = 1,
                    CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                    UpdatedAt = DateOnly.FromDateTime(DateTime.UtcNow),

                })
                .ToList();
                //add user notificatoin to the usernotifaction table if they are in the same org 
                var users = await _context.Users
                    .Where(u => u.Organisation == organisation)
                    .ToListAsync();
                foreach (var user in users)
                {
                    foreach (var notification in notificationsToAdd)
                    {
                        var userNotification = new UserNotification
                        {
                            Id = Guid.NewGuid(),
                            User = user,
                            Notification = notification,
                            ReadStatus = 0,
                            ReadAt = null
                        };
                        await _context.UserNotifications.AddAsync(userNotification);
                    }
                }

                if (notificationsToAdd.Any())
                {
                    await _context.Notifications.AddRangeAsync(notificationsToAdd);

                    // Update mattress statuses in bulk
                    await _context.Mattresses
                        .Where(m => m.Status == 3 && m.LatestDateRotate.HasValue && m.LatestDateRotate.Value <= DateTime.UtcNow)
                        .ExecuteUpdateAsync(s => s.SetProperty(m => m.Status, 7));

                    await _context.SaveChangesAsync();
                    return true;
                }
                else
                    return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CheckRotationNotification: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> CreateTranferOutNotificatoin()
        {
            try
            {
                var groups = await _context.Groups
                .Where(g => g.TransferOutPurpose == (TransferOutPurpose)1)
                .ToListAsync();

                // create notification for each group
                foreach (var group in groups)
                {

                    var notification = new Notification
                    {
                        Id = Guid.NewGuid(),
                        Message = $"Group  {group.Description} has been transferred out.",
                        Status = 0,
                        CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                        UpdatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                        Organisation = group.ReceiverOrganisation,
                    };
                    await _context.Notifications.AddAsync(notification);
                    // Add user notifications for each user in the group
                    var users = await _context.Users
                        .Where(u => u.Group == group)
                        .ToListAsync();
                    foreach (var user in users)
                    {
                        var userNotification = new UserNotification
                        {
                            Id = Guid.NewGuid(),
                            User = user,
                            Notification = notification,
                            ReadStatus = 0,
                            ReadAt = null
                        };
                        await _context.UserNotifications.AddAsync(userNotification);
                    }
                   

                }
                await _context.SaveChangesAsync();
                return true;


            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error itranferout nottification {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteNotificatoin(string NotificationId)
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
                else
                {
                    var notification = await _context.Notifications.FindAsync(Guid.Parse(NotificationId));
                    if (notification == null)
                    {
                        throw new Exception("Notification not found. Check token or database.");
                    }
                    _context.Notifications.Remove(notification);
                    await _context.SaveChangesAsync();
                    return true;


                }

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteNotification: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> CreateNewOrgNotification(String Messaege, Guid OrgId)
        {
            try
            {
                var organisation = await _context.Organisations.FindAsync(OrgId);
                if (organisation == null)
                {
                    throw new Exception("Organisation not found. Check token or database.");
                }
                else
                {
                    var notification = new Notification
                    {
                        Id = Guid.NewGuid(),
                        Message = Messaege,
                        Status = 0,
                        CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                        UpdatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                    };
                    await _context.Notifications.AddAsync(notification);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in createNewOrgNotification: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> CreateNewUserNotification(String Messaege, Guid UserId)
        {
            try
            {
                var user = await _context.Users.FindAsync(UserId);
                if (user == null)
                {
                    throw new Exception("User not found. Check token or database.");
                }
                else
                {
                    var notification = new Notification
                    {
                        Id = Guid.NewGuid(),
                        Message = Messaege,
                        Status = 0,
                        CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                        UpdatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                    };
                    await _context.Notifications.AddAsync(notification);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in createNewUserNotification: {ex.Message}");
                throw;
            }
        }

        //public async Task<bool> UpdateUserNotification(Guid NotificationId)
        //{
        //    try
        //    {
        //        var notification = await _context.UserNotifications.FindAsync(NotificationId);
        //        if (notification == null)
        //        {
        //            throw new Exception("Notification not found. Check token or database.");
        //        }
        //        else
        //        {
        //            notification.Status = 2;
        //            notification.UpdatedAt = DateOnly.FromDateTime(DateTime.UtcNow);
        //            await _context.SaveChangesAsync();
        //            return true;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error in UpdateUserNotification: {ex.Message}");
        //        throw;
        //    }
        //}

        public async Task<bool> UpdateNotificationStatus(Guid NotificationId)
        {
            try
            {
                var notification = await _context.Notifications.FindAsync(NotificationId);
                if (notification == null)
                {
                    throw new Exception("Notification not found. Check token or database.");
                }
                else
                {
                    notification.Status = 2;
                    notification.UpdatedAt = DateOnly.FromDateTime(DateTime.UtcNow);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateNotificationStatus: {ex.Message}");
                throw;
            }
        }

        public async Task<int> CountUnreadMessages(Guid UserId)
        {
            try 
            {
                var user = await _context.Users.FindAsync(UserId);
                if (user == null)
                {
                    throw new Exception("User not found. Check token or database.");
                }
                else
                {
                    var count = await _context.UserNotifications
                        .Where(n => n.User == user && n.ReadStatus == 0)
                        .CountAsync();
                    return count;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in CountUnreadMessages: {ex.Message}");
                throw;
            }
        }

        public async Task<UserNotificationDTO> GetUserNotificationById(Guid notificationId)
        {
            try
            {
                // Find UserNotification by NotificationId

                UserNotification userNotification = await _context.UserNotifications
                    .FirstOrDefaultAsync(n => n.Id == notificationId);

                if (userNotification == null)
                {
                    throw new Exception("UserNotification not found for the given NotificationId.");
                }

                // Fetch the Notification entity
                var notificationMessage = await _context.Notifications.FindAsync(notificationId);
                if (notificationMessage == null)
                {
                    throw new Exception("Notification message not found.");
                }

                // Update ReadStatus & ReadAt
                userNotification.ReadStatus = 1;
                userNotification.ReadAt = DateOnly.FromDateTime(DateTime.UtcNow);

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Return DTO
                return new UserNotificationDTO
                {
                    Id = userNotification.Id.ToString(),
                    NotificationMessaage = notificationMessage.Message,
                    ReadAt = userNotification.ReadAt,
                    ReadStatus = userNotification.ReadStatus
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetUserNotificationById: {ex.Message}");
                throw;
            }
        }

    }
}

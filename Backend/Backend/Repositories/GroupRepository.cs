using Backend.Common.Enums;
using Backend.Common.Utilities;
using Backend.DTOs.Mattress;
using Backend.Repositories.Interfaces;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using MatCron.Backend.Repositories.Interfaces;
using MatCron.Backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Backend.Entities;
using Backend.Repositories;

namespace MatCron.Backend.Repositories.Implementations
{
    public class GroupRepository : IGroupRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JwtUtils _jwtUtils;

        public GroupRepository(ApplicationDbContext context,IHttpContextAccessor httpContextAccessor, IConfiguration config)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _jwtUtils = new JwtUtils(config);
        }
        
        
    //     
    //
    //     //Creating a New group With the Organisation 
    //     public async Task<GroupDto> CreateGroupAsync(GroupCreateDto dto)
    // {
    //     try
    //     {
    //         // Validate sender organization
    //         var senderExists = await _context.Organisations.AnyAsync(o => o.Id == dto.SenderOrgId);
    //         if (!senderExists)
    //         {
    //             throw new Exception($"Sender organization with ID {dto.SenderOrgId} does not exist.");
    //         }
    //
    //         // Validate receiver organization
    //         var receiverExists = await _context.Organisations.AnyAsync(o => o.Id == dto.ReceiverOrgId);
    //         if (!receiverExists)
    //         {
    //             throw new Exception($"Receiver organization with ID {dto.ReceiverOrgId} does not exist.");
    //         }
    //
    //         // Validate group name uniqueness
    //         var groupNameExists = await _context.Groups.AnyAsync(g =>
    //             g.Name == dto.Name && g.SenderOrgId == dto.SenderOrgId);
    //         if (groupNameExists)
    //         {
    //             throw new Exception($"A group with the name '{dto.Name}' already exists for the sender organization.");
    //         }
    //
    //         // Create the group entity
    //         var newGroup = new Group
    //         {
    //             Id = Guid.NewGuid(),
    //             Name = dto.Name,
    //             Description = dto.Description,
    //             SenderOrgId = dto.SenderOrgId,
    //             ReceiverOrgId = dto.ReceiverOrgId,
    //             Status = GroupStatus.Active,
    //             CreatedDate = DateTime.UtcNow,
    //             TransferOutPurpose=dto.TransferOutPurpose
    //         };
    //
    //         _context.Groups.Add(newGroup);
    //         await _context.SaveChangesAsync();
    //
    //         // Map the group entity to a DTO
    //         return new GroupDto
    //         {
    //             Id = newGroup.Id,
    //             Name = newGroup.Name,
    //             Description = newGroup.Description,
    //             CreatedDate = newGroup.CreatedDate,
    //             Status = newGroup.Status,
    //             TransferOutPurpose=newGroup.TransferOutPurpose
    //         };
    //     }
    //     catch (Exception ex)
    //     {
    //         // Log full exception details
    //         Console.WriteLine($"Error: {ex.Message}");
    //         if (ex.InnerException != null)
    //         {
    //             Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
    //         }
    //         throw new Exception($"An error occurred while creating the group: {ex.Message}");
    //     }
    // }
    
    
    public async Task<GroupDto> CreateGroupAsync(GroupCreateDto dto)
{
    try
    {
        // Validate sender organization
        var senderOrg = await _context.Organisations
            .FirstOrDefaultAsync(o => o.Id == dto.SenderOrgId);
        if (senderOrg == null)
        {
            throw new Exception($"Sender organization with ID {dto.SenderOrgId} does not exist.");
        }

        // Validate receiver organization
        var receiverOrg = await _context.Organisations
            .FirstOrDefaultAsync(o => o.Id == dto.ReceiverOrgId);
        if (receiverOrg == null)
        {
            throw new Exception($"Receiver organization with ID {dto.ReceiverOrgId} does not exist.");
        }

        // Validate group name uniqueness
        var groupNameExists = await _context.Groups.AnyAsync(g =>
            g.Name == dto.Name && g.SenderOrgId == dto.SenderOrgId);
        if (groupNameExists)
        {
            throw new Exception($"A group with the name '{dto.Name}' already exists for the sender organization.");
        }

        // Create the group entity
        var newGroup = new Group
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description,
            SenderOrgId = dto.SenderOrgId,
            ReceiverOrgId = dto.ReceiverOrgId,
            Status = GroupStatus.Active,
            CreatedDate = DateTime.UtcNow,
            TransferOutPurpose = dto.TransferOutPurpose
        };

        _context.Groups.Add(newGroup);
        await _context.SaveChangesAsync();

        // Map the group entity to a DTO
        return new GroupDto
        {
            Id = newGroup.Id,
            Name = newGroup.Name,
            Description = newGroup.Description,
            CreatedDate = newGroup.CreatedDate,
            Status = newGroup.Status,
            MattressCount = 0, // New group has no mattresses yet
            SenderOrganisationName = senderOrg.Name, // Fetch sender org name
            ReceiverOrganisationName = receiverOrg.Name, // Fetch receiver org name
            TransferOutPurpose = newGroup.TransferOutPurpose,
            IsImported = false // Since it's created by sender, it's not imported
        };
    }
    catch (Exception ex)
    {
        // Log full exception details
        Console.WriteLine($"Error: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
        }
        throw new Exception($"An error occurred while creating the group: {ex.Message}");
    }
}

        
        
        //Adding Mattresses by selesting multiple mattresses and sending it along wit the group Id to add mattreses to a group 
        public async Task AddMattressesToGroupAsync(EditMattressesToGroupDto dto)
        {
            try
            {
                // Validate that the group exists
                var group = await _context.Groups.FirstOrDefaultAsync(g => g.Id == dto.GroupId);
                if (group == null)
                {
                    throw new Exception($"Group with ID {dto.GroupId} does not exist.");
                }

                // Ensure the group is not active
                if (group.Status == GroupStatus.Archived)
                {
                    throw new Exception("Mattresses cannot be assigned to an active group.");
                }

                // Validate that all mattress IDs exist
                var validMattressIds = await _context.Mattresses
                    .Where(m => dto.MattressIds.Contains(m.Uid))
                    .Select(m => m.Uid)
                    .ToListAsync();

                var invalidMattressIds = dto.MattressIds.Except(validMattressIds).ToList();
                if (invalidMattressIds.Any())
                {
                    throw new Exception($"The following mattresses are invalid: {string.Join(", ", invalidMattressIds)}");
                }

                // Check if any of the mattresses are already assigned to an active group
                var assignedToActiveGroups = await _context.MattressGroups
                    .Include(mg => mg.Group)
                    .Where(mg => dto.MattressIds.Contains(mg.MattressId) && mg.Group.Status == GroupStatus.Active)
                    .Select(mg => mg.MattressId)
                    .ToListAsync();

                if (assignedToActiveGroups.Any())
                {
                    throw new Exception($"The following mattresses are already assigned to active groups: {string.Join(", ", assignedToActiveGroups)}");
                }

                // Add new mattress-group relationships
                var mattressGroups = dto.MattressIds
                    .Select(mattressId => new MattressGroup
                    {
                        MattressId = mattressId,
                        GroupId = dto.GroupId,
                        DateAssociated = DateTime.UtcNow
                    });

                await _context.MattressGroups.AddRangeAsync(mattressGroups);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log exception or rethrow for the controller to handle
                throw new Exception($"An error occurred while adding mattresses to the group: {ex.Message}");
            }
        }
    
    public async Task<IEnumerable<GroupDto>> GetGroupsByStatusAsync(GroupRequestDto requestDto)
{
    try
    {
        // Extract the token from the HTTP context
        var token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"]
            .FirstOrDefault()?.Replace("Bearer ", string.Empty);

        Console.WriteLine($"Extracted Token: {token}");

        if (string.IsNullOrEmpty(token))
        {
            throw new Exception("Authorization token is missing.");
        }

        // Validate the token and extract claims
        var (principals, error) = _jwtUtils.ValidateToken(token);
        if (principals == null || !string.IsNullOrEmpty(error))
        {
            throw new Exception($"Token validation failed: {error}");
        }

        // Extract the OrgId claim from the token
        var orgIdClaim = principals.Claims.FirstOrDefault(c => c.Type == "OrgId");
        if (orgIdClaim == null)
        {
            throw new Exception("The 'OrgId' claim is missing in the token.");
        }

        if (!Guid.TryParse(orgIdClaim.Value, out var orgId))
        {
            throw new Exception($"The 'OrgId' claim value '{orgIdClaim.Value}' is not a valid GUID.");
        }

        Console.WriteLine($"Extracted OrgId from token: {orgId}");

        if (requestDto.GroupStatus == GroupStatus.Active)
        {
            var activeGroups = await _context.Groups
                .Where(g => g.SenderOrgId == orgId && g.Status == GroupStatus.Active)
                .Select(g => new GroupDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Description = g.Description,
                    CreatedDate = g.CreatedDate,
                    Status = g.Status,
                    MattressCount = g.MattressGroups.Count,
                    ReceiverOrganisationName = g.ReceiverOrganisation != null ? g.ReceiverOrganisation.Name : null,
                    SenderOrganisationName = g.SenderOrganisation != null ? g.SenderOrganisation.Name : null,
                    TransferOutPurpose = g.TransferOutPurpose,
                    IsImported = false // Active groups are always from the sender's perspective
                })
                .ToListAsync();

            return activeGroups;
        }
        else if (requestDto.GroupStatus == GroupStatus.Archived)
        {
            var archivedGroups = await _context.Groups
                .Where(g => 
                    (g.SenderOrgId == orgId || g.ReceiverOrgId == orgId) &&
                    g.Status == GroupStatus.Archived)
                .Select(g => new GroupDto
                {
                    Id = g.Id,
                    Name = g.Name,
                    Description = g.Description,
                    CreatedDate = g.CreatedDate,
                    Status = g.Status,
                    MattressCount = g.MattressGroups.Count,
                    ReceiverOrganisationName = g.ReceiverOrganisation != null ? g.ReceiverOrganisation.Name : null,
                    SenderOrganisationName = g.SenderOrganisation != null ? g.SenderOrganisation.Name : null,
                    TransferOutPurpose = g.TransferOutPurpose,
                    IsImported = g.ReceiverOrgId == orgId // If the extracted OrgId is the receiver, it's imported; otherwise, false
                })
                .ToListAsync();

            return archivedGroups;
        }
        else
        {
            throw new Exception("Invalid group status provided.");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error: {ex.Message}");
        throw new Exception($"An error occurred while retrieving groups: {ex.Message}");
    }
}

public async Task<GroupWithMattressesDto> GetGroupByIdAsync(Guid groupId)
{
    try
    {
        // Fetch group details and include related entities
        var group = await _context.Groups
            .Include(g => g.SenderOrganisation)
            .Include(g => g.ReceiverOrganisation)
            .Include(g => g.MattressGroups)
            .ThenInclude(mg => mg.Mattress)
            .ThenInclude(m => m.MattressType)
            .FirstOrDefaultAsync(g => g.Id == groupId);

        if (group == null)
        {
            throw new Exception($"Group with ID {groupId} does not exist.");
        }

        // Fetch mattresses assigned to the group
        var mattresses = group.MattressGroups
            .Where(mg => mg.Mattress != null)
            .Select(mg => new MattressDto
            {
                Uid = mg.Mattress.Uid.ToString(),
                MattressTypeId = mg.Mattress.MattressTypeId.ToString(),
                MattressTypeName = mg.Mattress.MattressType?.Name ?? "Unknown", // Fetch mattress type name
                location = mg.Mattress.Location,
                EpcCode = mg.Mattress.EpcCode,
                BatchNo = mg.Mattress.BatchNo,
                ProductionDate = mg.Mattress.ProductionDate,
                Status = mg.Mattress.Status,
                LifeCyclesEnd = mg.Mattress.LifeCyclesEnd,
                DaysToRotate = mg.Mattress.DaysToRotate,
                OrgId = mg.Mattress.OrgId?.ToString()
            })
            .ToList();

        // Construct the DTO response
        var groupDto = new GroupWithMattressesDto
        {
            Id = group.Id,
            Name = group.Name,
            Description = group.Description,
            SenderOrganisationName = group.SenderOrganisation?.Name,
            ReceiverOrganisationName = group.ReceiverOrganisation?.Name,
            MattressCount = mattresses.Count,
            CreatedDate = group.CreatedDate,
            ModifiedDate = group.ModifiedDate,
            MattressList = mattresses // Assign mattresses list
        };

        return groupDto;
    }
    catch (Exception ex)
    {
        throw new Exception($"An error occurred while retrieving group {groupId}: {ex.Message}");
    }
}

        
        
        
        public async Task RemoveMattressesFromGroupAsync(EditMattressesToGroupDto dto)
        {
            try
            {
                // Validate that the group exists
                var groupExists = await _context.Groups.AnyAsync(g => g.Id == dto.GroupId);
                if (!groupExists)
                {
                    throw new Exception($"Group with ID {dto.GroupId} does not exist.");
                }

                // Fetch mattress-group relationships to be removed
                var mattressGroupsToRemove = await _context.MattressGroups
                    .Where(mg => mg.GroupId == dto.GroupId && dto.MattressIds.Contains(mg.MattressId))
                    .ToListAsync();

                if (!mattressGroupsToRemove.Any())
                {
                    throw new Exception("No specified mattresses are assigned to the group.");
                }

                // Remove the relationships
                _context.MattressGroups.RemoveRange(mattressGroupsToRemove);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while removing mattresses from the group: {ex.Message}");
            }
        }
        
        
        public async Task TransferOutGroupAsync(Guid groupId)
        {
            try
            {
                // Validate that the group exists
                var group = await _context.Groups
                    .Include(g => g.MattressGroups)
                    .ThenInclude(mg => mg.Mattress)
                    .FirstOrDefaultAsync(g => g.Id == groupId);

                if (group == null)
                {
                    throw new Exception($"Group with ID {groupId} does not exist.");
                }

                // Update the status of all mattresses in the group to InTransit
                var mattressesToUpdate = group.MattressGroups.Select(mg => mg.Mattress).ToList();

                foreach (var mattress in mattressesToUpdate)
                {
                    mattress.Status = (byte)MattressStatus.InTransit; // Cast enum to byte
                }
                //creating org notificaiton
             //   NotificationRepository notificationRepository = new NotificationRepository(_context, _httpContextAccessor);
                //var notification = new Notification
                //{
                //    Id = Guid.NewGuid(),
                //    Organisation =group.ReceiverOrganisation, 
                //    Message = $"Group '{group.Name}' has been transferred out.",
                //    Status = 1,
                //    CreatedAt = DateOnly.FromDateTime(DateTime.UtcNow),
                //    UpdatedAt = DateOnly.FromDateTime(DateTime.UtcNow)
                //};


                //var users = await _context.Users.Where(u => u.OrgId == group.ReceiverOrganisation.Id).ToListAsync();
                //// create notification for user
                //var userNotifications = users.Select(user => new UserNotification
                //{
                //    Id = Guid.NewGuid(),
                //    Notification = notification,
                //    User = user, // Assign each user their own notification
                //    ReadStatus = 0,
                //    ReadAt = null,

                //}).ToList();

                ////add org notification to db
                //await _context.Notifications.AddAsync(notification);
                //// Add all user notifications to the database
                //await _context.UserNotifications.AddRangeAsync(userNotifications);

                // Save changes
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while transferring out the group: {ex.Message}");
            }
        }
        
        
        //Created to Display the essential data that is required when the Rfid is tap on any of the mattresses and this fetches its group details
        public async Task<GroupDto> ImportPreview(Guid mattressId)
        {
            try
            {
                // Fetch the active group the mattress is assigned to
                var activeGroup = await _context.MattressGroups
                    .Include(mg => mg.Group)
                    .ThenInclude(g => g.SenderOrganisation)
                    .Include(mg => mg.Group.ReceiverOrganisation)
                    .Where(mg => mg.MattressId == mattressId && mg.Group.Status == GroupStatus.Active)
                    .Select(mg => new GroupDto
                    {
                        Id = mg.Group.Id,
                        Name = mg.Group.Name,
                        Description = mg.Group.Description,
                        CreatedDate = mg.Group.CreatedDate,
                        Status = mg.Group.Status,
                        MattressCount = mg.Group.MattressGroups.Count,
                        SenderOrganisationName = mg.Group.SenderOrganisation.Name,
                        ReceiverOrganisationName = mg.Group.ReceiverOrganisation != null
                            ? mg.Group.ReceiverOrganisation.Name
                            : null,
                        TransferOutPurpose = mg.Group.TransferOutPurpose
                    })
                    .FirstOrDefaultAsync();

                if (activeGroup == null)
                {
                    throw new Exception($"No active group found for mattress ID {mattressId}.");
                }

                return activeGroup;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while fetching active group details for mattress ID {mattressId}: {ex.Message}");
            }
        }
        
        // Function Created so that the when mattresses are imported then all the mattresses are assigned the Receivers OrgId , it wipes the Location from the tabl 
        public async Task ImportMattressesFromGroupAsync(Guid groupId)
        {
            try
            {
                // Validating that the group exists and is active
                var group = await _context.Groups
                    .Include(g => g.MattressGroups)
                    .ThenInclude(mg => mg.Mattress)
                    .FirstOrDefaultAsync(g => g.Id == groupId);

                if (group == null)
                {
                    throw new Exception($"Group with ID {groupId} does not exist.");
                }

                // Ensuring that only active groups can be imported
                if (group.Status != GroupStatus.Active)
                {
                    throw new Exception("Only active groups can be imported.");
                }

                // Validating receiver organisation
                if (group.ReceiverOrgId == null)
                {
                    throw new Exception("Receiver organisation not assigned to the group.");
                }

                // Updating all mattresses in the group
                foreach (var mattressGroup in group.MattressGroups)
                {
                    var mattress = mattressGroup.Mattress;
                    if (mattress != null)
                    {
                        mattress.OrgId = group.ReceiverOrgId; // Assign receiver organisation ID for filtering
                        mattress.Location = null; // Clearing location
                    }
                }

                // Changing group status to Archived after import
                group.Status = GroupStatus.Archived;
                group.ModifiedDate = DateTime.Now;

                // Saving changes to the database
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while importing mattresses from the group: {ex.Message}");
            }
        }

        public async Task<List<string>> getOrgidsOfGroup(Guid groupId)
        {
            try
            {
                // Fetch the group
                var group = await _context.Groups
                    .Include(g => g.SenderOrganisation)
                    .Include(g => g.ReceiverOrganisation)
                    .FirstOrDefaultAsync(g => g.Id == groupId);
                if (group == null)
                {
                    throw new Exception($"Group with ID {groupId} does not exist.");
                }
                // Return the OrgIds of the sender and receiver
                return new List<string>
                {
                    group.SenderOrganisation.Id.ToString(),
                    group.ReceiverOrganisation?.Id.ToString()
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while fetching OrgIds of group {groupId}: {ex.Message}");
            }
        }











        // public async Task EditGroupAsync(EditGroupDto dto)
        // {
        //     try
        //     {
        //         // Fetch the group to be edited
        //         var group = await _context.Groups.FirstOrDefaultAsync(g => g.Id == dto.GroupId);
        //         if (group == null)
        //         {
        //             throw new Exception($"Group with ID {dto.GroupId} does not exist.");
        //         }
        //
        //         // Update group fields
        //         if (!string.IsNullOrWhiteSpace(dto.Name)) group.Name = dto.Name;
        //         if (!string.IsNullOrWhiteSpace(dto.Description)) group.Description = dto.Description;
        //
        //         // Always update sender and receiver
        //         group.SenderOrgId = dto.SenderOrgId;
        //         group.ReceiverOrgId = dto.ReceiverOrgId;
        //
        //         // Save changes to the database
        //         await _context.SaveChangesAsync();
        //     }
        //     catch (Exception ex)
        //     {
        //         throw new Exception($"An error occurred while editing the group: {ex.Message}");
        //     }
        // }

    }
}
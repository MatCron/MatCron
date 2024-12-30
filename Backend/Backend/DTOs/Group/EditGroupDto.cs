

namespace MatCron.Backend.DTOs
{
    public class EditGroupDto
    {
        public Guid GroupId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public Guid? SenderOrgId { get; set; }
        public Guid? ReceiverOrgId { get; set; }
    }
}
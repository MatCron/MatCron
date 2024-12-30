using System.ComponentModel.DataAnnotations;

namespace MatCron.Backend.DTOs
{
    public class GroupCreateDto
    {
        [Required(ErrorMessage = "The name field is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "The description field is required.")]
        public string Description { get; set; }

        [Required(ErrorMessage = "The orgId field is required.")]
        public Guid ReceiverOrgId { get; set; }
        
        [Required(ErrorMessage = "The SenderOrgId field is required.")]
        public Guid SenderOrgId { get; set; }
    }
}
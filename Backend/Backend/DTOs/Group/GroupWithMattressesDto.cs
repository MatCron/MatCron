using Backend.DTOs.Mattress;

namespace MatCron.Backend.DTOs;

public class GroupWithMattressesDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public string? SenderOrganisationName { get; set; }
    public string? ReceiverOrganisationName { get; set; }
    public int MattressCount { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public List<MattressDto> MattressList { get; set; } = new List<MattressDto>();
}
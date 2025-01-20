namespace MatCron.Backend.DTOs;

public class EditMattressesToGroupDto
{
    public Guid GroupId { get; set; }
    public IEnumerable<Guid> MattressIds { get; set; } = new List<Guid>();
}
using Backend.DTOs.Organisation;

namespace Backend.DTOs.Mattress
{
    public class MattressDetailedDto
    {
        public string Uid { get; set; } // Primary Key
        public string MattressTypeId { get; set; } // Foreign Key to MattressType
        public string? BatchNo { get; set; }
        public DateTime ProductionDate { get; set; }
        public OrganisationDTO? Org { get; set; } // Foreign Key to User
        public string? EpcCode { get; set; }
        public int? Status { get; set; }
        public DateTime? LifeCyclesEnd { get; set; }
        public int? DaysToRotate { get; set; }
        public string MattressType { get; set; }
        public string Organisation { get; set; }
    }
}

using Backend.DTOs.Organisation;
using MatCron.Backend.DTOs;

namespace Backend.DTOs.Mattress
{
    public class MattressDetailedDto
    {
        public string Uid { get; set; } // Primary Key
        public string? BatchNo { get; set; }
        public DateTime? ProductionDate { get; set; }
        public OrganisationDTO? Org { get; set; } 
        public string? EpcCode { get; set; }

        public string? Location { get; set; }
        public int? Status { get; set; }
        public DateTime? LifeCyclesEnd { get; set; }
        public int? DaysToRotate { get; set; }
        public MattressTypeDTO MattressType { get; set; }
    }
}

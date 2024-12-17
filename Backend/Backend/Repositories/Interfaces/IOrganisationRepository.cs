using Backend.DTOs.Organisation;

namespace Backend.Repositories.Interfaces
{
    public interface IOrganisationRepository
    {
        Task<List<OrganisationDTO>> GetAllOrganistation();
        Task<OrganisationDTO> GetOrganisationById(string id);
        Task<OrganisationDTO> CreateOrganisation(OrganisationDTO organisation);
        Task<OrganisationDTO> UpdateOrganisation(OrganisationDTO organisation);
        Task<bool> DeleteOrganisation(string id);
        Task<OrganisationDTO> GetOrganisationByCode(string organisationCode);
    }
}

using Backend.DTOs.Organisation;

namespace Backend.Repositories.Interfaces
{
    public interface IOrganisationRepository
    {
        Task<List<OrganisationDTO>> GetAll();
        Task<OrganisationDTO> GetById(string id);
        Task<OrganisationDTO> Create(OrganisationDTO organisation);
        Task<OrganisationDTO> Update(OrganisationDTO organisation);
        Task<bool> Delete(string id);
        Task<OrganisationDTO> GetOrganisationByCode(string organisationCode);
    }
}

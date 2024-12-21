using Backend.DTOs.Organisation;
using MatCron.Backend.Entities;

namespace Backend.Common.Converters
{
    public class OrganisationConverter
    {

        public static  OrganisationDTO EntityToDto(Organisation organisation)
        {
            OrganisationDTO dto = new OrganisationDTO();
            dto.Id = organisation.Id.ToString();
            dto.Name = organisation.Name;
            dto.Email = organisation.Email;
            dto.Description = organisation.Description;
            dto.PostalAddress = organisation.PostalAddress;
            dto.NormalAddress = organisation.NormalAddress;
            dto.WebsiteLink = organisation.WebsiteLink;
            dto.Logo = organisation.Logo;
            dto.RegistrationNo = organisation.RegistrationNo;
            dto.OrganisationType = organisation.OrganisationType;
            dto.OrganisationCode = organisation.OrganisationCode;

            return dto;
        }

        public static Organisation DtoToEntity(OrganisationDTO dto)
        {
            var organisation = new Organisation();
            organisation.Id = Guid.Parse(dto.Id);
            organisation.Name = dto.Name;
            organisation.Email = dto.Email;
            organisation.Description = dto.Description;
            organisation.PostalAddress = dto.PostalAddress;
            organisation.NormalAddress = dto.NormalAddress;
            organisation.WebsiteLink = dto.WebsiteLink;
            organisation.Logo = dto.Logo;
            organisation.RegistrationNo = dto.RegistrationNo;
            organisation.OrganisationType = dto.OrganisationType;
            organisation.OrganisationCode = dto.OrganisationCode;

            return organisation;
        }
    }
}

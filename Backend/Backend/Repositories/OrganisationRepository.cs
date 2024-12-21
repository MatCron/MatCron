

using Backend.DTOs.Organisation;
using Backend.DTOs;
using Backend.Repositories.Interfaces;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.Metrics;

namespace Backend.Repositories
{
    public class OrganisationRepository : IOrganisationRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        public OrganisationRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<List<OrganisationSummariseResponseDto>> GetAllOrganisations()
        {
            try
            {
                var organisations = await _context.Organisations.AsNoTracking().Select(o => new OrganisationSummariseResponseDto
                {
                    Id = o.Id.ToString(),
                    Name = o.Name,
                    OrganisationType = o.OrganisationType
                } ).ToListAsync();
                return organisations;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving organisations: {ex.Message}");
                throw new Exception($"An error occurred: {ex.Message}");
            }
        }

        public async Task<OrganisationDTO> GetOrganisationById(string id)
        {
            try
            {

                var organisation = await _context.Organisations
                    .AsNoTracking() // Avoid tracking for read-only operations
                    .FirstOrDefaultAsync(o => o.Id == Guid.Parse(id));

                if (organisation == null)
                {
                    throw new Exception($"No organisation found for ID: {id}");
                }

                return  EntityToDto(organisation);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving organisation by ID: {ex.Message}");
                throw new Exception($"An error occurred: {ex.Message}");
            }
        }

        public async Task<OrganisationDTO> CreateOrganisation(OrganisationDTO dto)
        {
            try
            {
                // Check if the organisation code is unique
                var existingOrganisation = await _context.Organisations
                    .AsNoTracking()
                    .FirstOrDefaultAsync(o => o.OrganisationCode == dto.OrganisationCode);

                if (existingOrganisation != null)
                {
                    throw new Exception($"Organisation code {dto.OrganisationCode} already exists");
                }

                // Add the organisation to the database 
                Console.WriteLine(dto);

                    Organisation organisation = new Organisation()
                    {
                        Id = Guid.NewGuid(),
                        Name = dto.Name ?? "",
                        Email = dto.Email ?? throw new Exception("Email not found"),
                        Description = dto.Description ?? "",
                        PostalAddress = dto.PostalAddress ?? "",
                        NormalAddress = dto.NormalAddress ?? "",
                        WebsiteLink = dto.WebsiteLink ?? "",
                        Eir = dto.Eir ?? "",
                        County = dto.County ?? "",
                        Logo = "",
                        RegistrationNo = dto.RegistrationNo ?? "",
                        OrganisationType = dto.OrganisationType ?? "",
                        OrganisationCode = dto.OrganisationCode ?? throw new Exception("Organisation code not found")
                    };



                _context.Organisations.Add(organisation);
                await _context.SaveChangesAsync();

                return EntityToDto(organisation);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating organisation: {ex.Message}");
                throw new Exception($"An error occurred: {ex.Message}");
            }
        }

        public async Task<OrganisationDTO> UpdateOrganisation(OrganisationDTO dto)
        {
            try
            {
                
                // Check if the organisation exists
                var existingOrganisation = await _context.Organisations
                    .AsNoTracking()
                    .FirstOrDefaultAsync(o => o.Id == Guid.Parse(dto.Id));

                if (existingOrganisation == null)
                {
                    throw new Exception($"No organisation found for ID: {dto.Id}");
                }

                existingOrganisation.Name = dto.Name ?? existingOrganisation.Name;
                existingOrganisation.Email = dto.Email ?? existingOrganisation.Email;
                existingOrganisation.Description = dto.Description ?? existingOrganisation.Description;
                existingOrganisation.PostalAddress = dto.PostalAddress ?? existingOrganisation.PostalAddress;
                existingOrganisation.NormalAddress = dto.NormalAddress ?? existingOrganisation.NormalAddress;
                existingOrganisation.WebsiteLink = dto.WebsiteLink ?? existingOrganisation.WebsiteLink;
                existingOrganisation.Eir = dto.Eir ?? existingOrganisation.Eir;
                existingOrganisation.County = dto.County ?? existingOrganisation.County;
                existingOrganisation.Logo = dto.Logo ?? existingOrganisation.Logo;
                existingOrganisation.RegistrationNo = dto.RegistrationNo ?? existingOrganisation.RegistrationNo;
                existingOrganisation.OrganisationType = dto.OrganisationType ?? existingOrganisation.OrganisationType;

                // Update the organisation
                _context.Organisations.Update(existingOrganisation);
                await _context.SaveChangesAsync();

                return EntityToDto(existingOrganisation);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating organisation: {ex.Message}");
                throw new Exception($"An error occurred: {ex.Message}");
            }
        }

        public async Task<bool> DeleteOrganisation(string id)
        {
            try
            {
                // Check if the organisation exists
                var existingOrganisation = await _context.Organisations
                    .AsNoTracking()
                    .FirstOrDefaultAsync(o => o.Id == Guid.Parse(id));

                if (existingOrganisation == null)
                {
                    throw new Exception($"No organisation found for ID: {id}");
                }

                // Delete the organisation
                _context.Organisations.Remove(existingOrganisation);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting organisation: {ex.Message}");
                throw new Exception($"An error occurred: {ex.Message}");
            }
        }

        public async Task<OrganisationDTO> GetOrganisationByCode(string organisationCode)
        {
            try
            {
                var organisation = await _context.Organisations
                    .AsNoTracking() // Avoid tracking for read-only operations
                    .FirstOrDefaultAsync(o => o.OrganisationCode == organisationCode);

                if (organisation == null)
                {
                    throw new Exception($"No organisation found for code: {organisationCode}");
                }

                return EntityToDto(organisation);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error retrieving organisation by code: {ex.Message}");
                throw new Exception($"An error occurred: {ex.Message}");
            }
        }

        public OrganisationDTO EntityToDto(Organisation organisation)
        {
            OrganisationDTO dto = new OrganisationDTO();
            dto.Id = organisation.Id.ToString();
            dto.Name = organisation.Name;
            dto.Email = organisation.Email;
            dto.Description = organisation.Description;
            dto.PostalAddress = organisation.PostalAddress;
            dto.NormalAddress = organisation.NormalAddress;
            dto.WebsiteLink = organisation.WebsiteLink;
            dto.Eir = organisation.Eir;
            dto.County = organisation.County;
            dto.Logo = organisation.Logo;
            dto.RegistrationNo = organisation.RegistrationNo;
            dto.OrganisationType = organisation.OrganisationType;
            dto.OrganisationCode = organisation.OrganisationCode;

            return dto;
        }

        public Organisation DtoToEntity(OrganisationDTO dto)
        {
            var organisation = new Organisation();
            organisation.Id = Guid.Parse(dto.Id);
            organisation.Name = dto.Name;
            organisation.Email = dto.Email;
            organisation.Description = dto.Description;
            organisation.PostalAddress = dto.PostalAddress;
            organisation.NormalAddress = dto.NormalAddress;
            organisation.WebsiteLink = dto.WebsiteLink;
            organisation.Eir = dto.Eir;
            organisation.County = dto.County;
            organisation.Logo = dto.Logo;
            organisation.RegistrationNo = dto.RegistrationNo;
            organisation.OrganisationType = dto.OrganisationType;
            organisation.OrganisationCode = dto.OrganisationCode;

            return organisation;
        }

    }
}

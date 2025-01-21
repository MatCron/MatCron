using Backend.Repositories;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;
using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTOs.Organisation;
using MatCron.Backend.Data;

namespace Backend.Testing.OrgTest
{
	public class OrganisationRepositoryTests
	{
		private ApplicationDbContext GetInMemoryContext()
		{
			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(Guid.NewGuid().ToString())
				.Options;

			var context = new ApplicationDbContext(options);
			SeedData(context);
			return context;
		}

		private IConfiguration GetMockConfiguration()
		{
			var config = new Mock<IConfiguration>();
			return config.Object;
		}

		private void SeedData(ApplicationDbContext context)
		{
			context.Organisations.AddRange(new List<Organisation>
			{
				new Organisation
				{
					Id =  Guid.Parse("123e4567-e89b-12d3-a456-426614174000"),
					Name = "SeedOrg1",
					Email = "seed1@example.com",
					Description = "Description for SeedOrg1",
					PostalAddress = "Postal Address 1",
					NormalAddress = "Normal Address 1",
					WebsiteLink = "http://seedorg1.com",
					Logo = "logo1.png",
					RegistrationNo = "REG123",
					OrganisationType = "Type1",
					OrganisationCode = "CODE1"
				},
				new Organisation
				{
					Id = Guid.NewGuid(),
					Name = "SeedOrg2",
					Email = "seed2@example.com",
					Description = "Description for SeedOrg2",
					PostalAddress = "Postal Address 2",
					NormalAddress = "Normal Address 2",
					WebsiteLink = "http://seedorg2.com",
					Logo = "logo2.png",
					RegistrationNo = "REG456",
					OrganisationType = "Type2",
					OrganisationCode = "CODE2"
				}
			});

			context.SaveChanges();
		}

		[Fact]
		public async Task GetAllOrganisations_ShouldReturnAllOrganisations()
		{
			// Arrange
			var context = GetInMemoryContext();
			var config = GetMockConfiguration();
			var repository = new OrganisationRepository(context, config);

			// Act
			var result = await repository.GetAllOrganisations();

			// Assert
			result.Should().NotBeNullOrEmpty().And.HaveCount(2);
			result[0].Name.Should().Be("SeedOrg1");
			result[1].Name.Should().Be("SeedOrg2");
		}

		[Fact]
		public async Task GetOrganisationById_ShouldReturnOrganisation_WhenOrganisationExists()
		{
			// Arrange
			var context = GetInMemoryContext();
			var config = GetMockConfiguration();
			var repository = new OrganisationRepository(context, config);

			var Id = "123e4567-e89b-12d3-a456-426614174000";

			// Act
			var result = await repository.GetOrganisationById(Id);

			// Assert
			result.Should().NotBeNull();
			result.Name.Should().Be("SeedOrg1");
		}

		[Fact]
		public async Task GetOrganisationById_ShouldThrowException_WhenOrganisationDoesNotExist()
		{
			// Arrange
			var context = GetInMemoryContext();
			var config = GetMockConfiguration();
			var repository = new OrganisationRepository(context, config);
			string id = "223e4567-e89b-12d3-a456-426614174000";

			// Act
			Func<Task> act = async () => await repository.GetOrganisationById(id);

			// Assert
			await act.Should().ThrowAsync<Exception>().WithMessage("An error occurred: No organisation found for ID: 223e4567-e89b-12d3-a456-426614174000");
		}

		[Fact]
		public async Task CreateOrganisation_ShouldAddOrganisation_WhenDataIsValid()
		{
			// Arrange
			var context = GetInMemoryContext();
			var config = GetMockConfiguration();
			var repository = new OrganisationRepository(context, config);

			var organisationDto = new OrganisationDTO
			{
				Name = "NewOrg",
				Email = "neworg@example.com",
				OrganisationCode = "ORG123",
				OrganisationType = "TypeA"
			};

			// Act
			var result = await repository.CreateOrganisation(organisationDto);

			// Assert
			result.Should().NotBeNull();
			result.Name.Should().Be("NewOrg");

			var createdOrganisation = await context.Organisations.FirstOrDefaultAsync(o => o.OrganisationCode == "ORG123");
			createdOrganisation.Should().NotBeNull();
			createdOrganisation.Name.Should().Be("NewOrg");
		}

		[Fact]
		public async Task UpdateOrganisation_ShouldUpdateOrganisation_WhenDataIsValid()
		{
			// Arrange
			var context = GetInMemoryContext();
			var config = GetMockConfiguration();
			var repository = new OrganisationRepository(context, config);

			var id = Guid.Parse("123e4567-e89b-12d3-a456-426614174000");
			var updatedDto = new OrganisationDTO
			{
				Id = "123e4567-e89b-12d3-a456-426614174000",
				Name = "UpdatedName",
				Email = "updatedemail@example.com"
			};

			// Act
			var result = await repository.UpdateOrganisation(updatedDto);

			// Assert
			result.Should().NotBeNull();
			result.Name.Should().Be("UpdatedName");

			var updatedOrganisation = await context.Organisations.FirstOrDefaultAsync(o => o.Id == id);
			updatedOrganisation.Should().NotBeNull();
			updatedOrganisation.Email.Should().Be("updatedemail@example.com");
		}

		[Fact]
		public async Task DeleteOrganisation_ShouldRemoveOrganisation_WhenOrganisationExists()
		{
			// Arrange
			var context = GetInMemoryContext();
			var config = GetMockConfiguration();
			var repository = new OrganisationRepository(context, config);

			var id = "123e4567-e89b-12d3-a456-426614174000";
			// Act
			var result = await repository.DeleteOrganisation(id);

			// Assert
			result.Should().BeTrue();

			/*var deletedOrganisation = await context.Organisations.FirstOrDefaultAsync(o => o.Id == Guid.Parse(id));
			deletedOrganisation.Should().BeNull();*/
		}

		[Fact]
		public async Task DeleteOrganisation_ShouldThrowException_WhenOrganisationDoesNotExist()
		{
			// Arrange
			var context = GetInMemoryContext();
			var config = GetMockConfiguration();
			var repository = new OrganisationRepository(context, config);
			var id = Guid.NewGuid().ToString();

			// Act
			Func<Task> act = async () => await repository.DeleteOrganisation(id);

			// Assert
			await act.Should().ThrowAsync<Exception>().WithMessage($"An error occurred: No organisation found for ID: {id}");
		}
	}

}

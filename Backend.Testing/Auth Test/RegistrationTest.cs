//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Microsoft.EntityFrameworkCore.InMemory;
//using Moq;
//using Xunit;
//using FluentAssertions;
//using Backend.DTOs.Auth;
//using Backend.Repositories.Interfaces;
//using MatCron.Backend.DTOs;
//using MatCron.Backend.Entities;
//using MatCron.Backend.Repositories.Implementations;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Configuration;
//using Backend.Testing.Auth_Test;
//using Microsoft.AspNetCore.Http;
//using MatCron.Backend.Repositories.Interfaces;
//using MatCron.Backend.Data;
//using MatCron.Backend.Repositories;
//using Backend.Repositories;



//namespace Backend.Testing.Auth_Test
//{

//	public class RegistrationTest
//	{
//		private readonly ApplicationDbContext _dbContext;
//		private readonly Mock<IConfiguration> _configMock;
//		private readonly UserRepository _userRepository;
//        private readonly IHttpContextAccessor _httpContextAccessor;

//        public RegistrationTest()
//		{
//			// Configure the in-memory database
//			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
//				.UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
//				.Options;

//			_dbContext = new ApplicationDbContext(options);



//			// Seed the database
//			SeedDatabase(_dbContext);

//			_configMock = new Mock<IConfiguration>();
//			_userRepository = new UserRepository(_dbContext, _httpContextAccessor, _configMock.Object);
//		}

//		private void SeedDatabase(ApplicationDbContext dbContext)
//		{
//			// Add mock Organisations
//			var org1 = new Organisation
//			{
//				Id = Guid.Parse("123e4567-e89b-12d3-a456-426614174000"),
//				Name = "Test Organisation",
//				Email = "testorg@example.com",
//				OrganisationCode = "ORG001"
//			};

//			var org2 = new Organisation
//			{
//				Id = Guid.NewGuid(),
//				Name = "Another Organisation",
//				Email = "anotherorg@example.com",
//				OrganisationCode = "ORG002"
//			};

//			dbContext.Organisations.AddRange(org1, org2);

//			// Add mock Users
//			var user1 = new User
//			{
//				Id = Guid.NewGuid(),
//				OrgId = org1.Id,
//				FirstName = "John",
//				LastName = "Doe",
//				Password = "correctpassword",
//				Email = "johndoe@example.com",
//				EmailVerified = 1,
//				UserType = 1
//			};

//			var user2 = new User
//			{
//				Id = Guid.NewGuid(),
//				OrgId = org2.Id,
//				FirstName = "Jane",
//				LastName = "Smith",
//				Password = "anotherpassword",
//				Email = "janesmith@example.com",
//				EmailVerified = 1,
//				UserType = 2
//			};

//			dbContext.Users.AddRange(user1, user2);

//			dbContext.SaveChanges();
//		}
//		//Registeration test

//		[Fact]
//		public async Task RegisterUserAsync_ShouldReturnBadRequest_WhenFirstNameIsEmpty()
//		{
//			// Arrange
//			var dto = new RegistrationRequestDto
//			{
//				FirstName = string.Empty,
//				LastName = "Doe",
//				Email = "johndoe@example.com",
//				OrganisationCode = "ORG001"
//			};

//			// Act
//			var result = await _userRepository.RegisterUserAsync(dto);

//			// Assert
//			var badRequestResult = result as BadRequestObjectResult;
//			badRequestResult.Should().NotBeNull();
//			badRequestResult?.Value.Should().BeEquivalentTo(new
//			{
//				success = false,
//				message = "First Name is required."
//			});
//		}

//		[Fact]
//		public async Task RegisterUserAsync_ShouldReturnConflict_WhenFullNameAlreadyExists()
//		{
//			// Arrange
//			var dto = new RegistrationRequestDto
//			{
//				FirstName = "John",
//				LastName = "Doe",
//				Email = "johndoe@example.com",
//				OrganisationCode = "ORG001"
//			};

//			// Act
//			var result = await _userRepository.RegisterUserAsync(dto);

//			// Assert
//			var conflictResult = result as ConflictObjectResult;
//			conflictResult.Should().NotBeNull();
//			conflictResult.Value.Should().BeEquivalentTo(new
//			{
//				success = false,
//				message = "A user with the same Full Name already exists."
//			});
//		}
//		[Fact]
//		public async Task RegisterUserAsync_ShouldReturnConflict_WhenEmailAlreadyExists()
//		{
//			// Arrange
//			var dto = new RegistrationRequestDto
//			{
//				FirstName = "John",
//				LastName = "Doeee",
//				Email = "johndoe@example.com",
//				OrganisationCode = "ORG001"
//			};

//			// Act
//			var result = await _userRepository.RegisterUserAsync(dto);

//			// Assert
//			var conflictResult = result as ConflictObjectResult;
//			conflictResult.Should().NotBeNull();
//			conflictResult?.Value.Should().BeEquivalentTo(new
//			{
//				success = false,
//				message = "The Email Address is already in use."
//			});
//		}

//		[Fact]
//		public async Task RegisterUserAsync_ShouldReturnOk_WhenUserIsRegisteredSuccessfully()
//		{
//			EncryptionHelper encryptionHelper = new EncryptionHelper();
//			string password = encryptionHelper.EncryptPassword("password123");
//			// Arrange
//			var dto = new RegistrationRequestDto
//			{
//				FirstName = "Phiip",
//				LastName = "Doe",
//				Email = "philip@example.com",
//				OrganisationCode = "123e4567-e89b-12d3-a456-426614174000",
//				Password = password,
//				UserType = Common.Enums.UserTypeEnum.Admin
//			};


//			// Act
//			var result = await _userRepository.RegisterUserAsync(dto);
			

//			// Assert
//			var okResult = result as OkObjectResult;
//			//var conflictObjectResult = result as ConflictObjectResult;
//			//conflictObjectResult.Should().NotBeNull();
//			//conflictObjectResult?.Value.Should().BeEquivalentTo(new
//			//{
//			//	success = false,
//			//	message = "p"
//			//});
//			okResult.Should().NotBeNull();
//			okResult?.Value.Should().BeEquivalentTo(new
//			{
//				success = true,
//				message = "User registered successfully.",
//				userId = It.IsAny<Guid>()
//			});
//		}

//		[Fact]
//		public async Task LoginUserAsync_ShouldReturnNotFound_WhenUserDoesNotExist()
//		{
//			// Arrange
//			var dto = new LoginRequestDto
//			{
//				Email = "nonexistent@example.com",
//				Password = "password"
//			};

//			// Act
//			var result = await _userRepository.LoginUserAsync(dto);

//			// Assert
//			var notFoundResult = result as NotFoundObjectResult;
//			notFoundResult.Should().NotBeNull();
//			notFoundResult.Should().NotBeNull();
//			notFoundResult?.Value.Should().BeEquivalentTo(new
//			{
//				success = false,
//				error = "User invalid"
//			});
//		}

//		[Fact]
//		public async Task LoginUserAsync_ShouldReturnUnauthorized_WhenPasswordIsIncorrect()
//		{
//			// Arrange
//			EncryptionHelper encryptionHelper = new EncryptionHelper();
//			var password = encryptionHelper.EncryptPassword("password123");
//			var dto = new LoginRequestDto
//			{
//				Email = "johndoe@example.com",
//				Password = password
//			};

//			// Act
//			var result = await _userRepository.LoginUserAsync(dto);

//			// Assert
//			var unauthorizedResult = result as UnauthorizedObjectResult;
//			unauthorizedResult.Should().NotBeNull();
//			unauthorizedResult.Should().NotBeNull();
//			unauthorizedResult?.Value.Should().BeEquivalentTo(new
//			{
//				success = false,
//				error = "Password invalid"
//			});
//		}

//		[Fact]
//		public async Task LoginUserAsync_ShouldReturnOk_WhenLoginIsSuccessful()
//		{
//			// Arrange
//			//_configMock.Setup(c => c["Jwt:Key"]).Returns("YourSecretKey");

//			var dto = new LoginRequestDto
//			{
//				Email = "johndoe@example.com",
//				Password = "correctpassword"
//			};

//			// Act
//			var result = await _userRepository.LoginUserAsync(dto);

//			// Assert
//			var okResult = result as OkObjectResult;
//			okResult.Should().NotBeNull();
//			var response = okResult.Value as dynamic;
//			response.success.Should().BeTrue();
//			response.message.Should().Be("new token generated");
//			response.data.Should().NotBeNull();
//		}


//	}
//}

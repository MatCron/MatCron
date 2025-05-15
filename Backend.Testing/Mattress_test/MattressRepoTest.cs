using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Backend.Common.Utilities;
using Backend.DTOs.Mattress;
using Backend.Repositories;
using MatCron.Backend.Data;
using Microsoft.AspNetCore.Http;
using Moq;
using Backend.Testing.Mattress_test;
using Microsoft.Extensions.Configuration;
using Backend.Common.Utilities;
using Backend.Repositories.Interfaces;

namespace Backend.Testing.Mattress_test
{
	public class MattressRepoTest
	{
		private readonly MattressRepository _repository;
		private readonly ApplicationDbContext _context;
		private readonly Mock<IHttpContextAccessor> _httpContextAccessorMock;
		private readonly JwtUtils _jwtUtilsMock;
		private readonly Mock<ILogRepository> _log;

        public MattressRepoTest()
		{
			_context = RepoTestSetup.GetInMemoryContext();
			_httpContextAccessorMock = new Mock<IHttpContextAccessor>();
			_log = new Mock<ILogRepository>();
            var configurationMock = new Mock<IConfiguration>();

            _repository = new MattressRepository(_context, _httpContextAccessorMock.Object, configurationMock.Object, _log.Object);
            _jwtUtilsMock = new JwtUtils(configurationMock.Object);
        }

		//[Fact]
		//public async Task GetAllMattressesAsync_ShouldReturnMattresses()
		//{
		//	// Arrange
		//	var fakeToken = "Bearer fake-token";
		//	_httpContextAccessorMock
		//		.Setup(x => x.HttpContext.Request.Headers["Authorization"])
		//		.Returns(fakeToken);
		//	_jwtUtilsMock
		//		.Setup(x => x.ValidateToken(It.IsAny<string>()))
		//		.Returns((new ClaimsPrincipal(), null));

		//	// Act
		//	var result = await _repository.GetAllMattressesAsync();

		//	// Assert
		//	Assert.NotNull(result);
		//	Assert.NotEmpty(result);
		//	Assert.Equal(2, result.Count());
		//}

		[Fact]
		public async Task GetMattressByIdAsync_ShouldReturnCorrectMattress()
		{
			// Arrange
			var mattressId = _context.Mattresses.First().Uid.ToString();

			// Act
			var result = await _repository.GetMattressByIdAsync(mattressId);

			// Assert
			Assert.NotNull(result);
			Assert.Equal(mattressId, result.Uid);
		}

		[Fact]
		public async Task AddMattressAsync_ShouldAddMattress()
		{
			// Arrange
			var newMattress = new MattressDto
			{
				BatchNo = "B125",
				MattressTypeId = _context.MattressTypes.First().Id.ToString(),
				location = "Room 103",
				Status = 1,
				DaysToRotate = 45
			};

			// Act
			var result = await _repository.AddMattressAsync(newMattress);

			// Assert
			Assert.NotNull(result);
			Assert.Equal(newMattress.BatchNo, result.BatchNo);
			Assert.Equal(newMattress.location, result.location);
			Assert.Equal(newMattress.Status, result.Status);
		}

		[Fact]
		public async Task EditMattressAsync_ShouldUpdateMattress()
		{
			// Arrange
			var mattressId = _context.Mattresses.First().Uid.ToString();
			var updatedDto = new MattressDto
			{
				location = " Room",
				Status = 2
			};

			// Act
			var result = await _repository.EditMattressAsync(mattressId, updatedDto);

			// Assert
			Assert.NotNull(result);
			
			Assert.Equal(updatedDto.Status, result.Status);
		}

		[Fact]
		public async Task DeleteMattressAsync_ShouldRemoveMattress()
		{
			// Arrange
			var mattressId = _context.Mattresses.First().Uid.ToString();

			// Act
			var result = await _repository.DeleteMattressAsync(mattressId);

			// Assert
			Assert.True(result);
			Assert.Null(await _context.Mattresses.FindAsync(Guid.Parse(mattressId)));
		}
	}
}

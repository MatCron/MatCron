using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Moq;



namespace MatCronTest.RegistrationTest
{
	public class RegsistrationUnitTest
	{
		//testing nameing convention: ClassName_MethodName_Scenario_ExpectedBehavior
		[Fact]
		public async Task Register_ValidUser_ReturnsTrue()
		{
			// Arrange
			var mockRepo = new Mock<IUserRepository>();
			var validUser = new User { Username = "testuser", Email = "test@example.com" };
			mockRepo.Setup(repo => repo.AddUserAsync(validUser)).ReturnsAsync(true);

			var service = new UserService(mockRepo.Object);

			// Act
			var result = await service.Register(validUser);

			// Assert
			Assert.True(result);
			mockRepo.Verify(repo => repo.AddUserAsync(validUser), Times.Once);
		}

		[Fact]
		public async Task Register_DuplicateUser_ReturnsFalse()
		{
			// Arrange
			var mockRepo = new Mock<IUserRepository>();
			var duplicateUser = new User { Username = "existinguser", Email = "existing@example.com" };
			mockRepo.Setup(repo => repo.AddUserAsync(duplicateUser)).ReturnsAsync(false);

			var service = new UserService(mockRepo.Object);

			// Act
			var result = await service.Register(duplicateUser);

			// Assert
			Assert.False(result);
			mockRepo.Verify(repo => repo.AddUserAsync(duplicateUser), Times.Once);
		}

		[Fact]
		public async Task Register_NullUser_ThrowsArgumentNullException()
		{
			// Arrange
			var mockRepo = new Mock<IUserRepository>();
			var service = new UserService(mockRepo.Object);

			// Act & Assert
			await Assert.ThrowsAsync<ArgumentNullException>(() => service.Register(null));
		}

		[Fact]
		public async Task Register_RepositoryThrowsException_ReturnsFalse()
		{
			// Arrange
			var mockRepo = new Mock<IUserRepository>();
			var user = new User { Username = "user", Email = "user@example.com" };
			mockRepo.Setup(repo => repo.AddUserAsync(user)).ThrowsAsync(new Exception("Database error"));

			var service = new UserService(mockRepo.Object);

			// Act
			var result = await service.Register(user);

			// Assert
			Assert.False(result);
		}

		[Fact]
		public async Task Register_UserWithMissingFields_ReturnsFalse()
		{
			// Arrange
			var mockRepo = new Mock<IUserRepository>();
			var incompleteUser = new User { Username = "", Email = "" };
			mockRepo.Setup(repo => repo.AddUserAsync(incompleteUser)).ReturnsAsync(false);

			var service = new UserService(mockRepo.Object);

			// Act
			var result = await service.Register(incompleteUser);

			// Assert
			Assert.False(result);
		}

		[Fact]
		public async Task Register_ConcurrentRegistrations_BothHandledCorrectly()
		{
			// Arrange
			var mockRepo = new Mock<IUserRepository>();
			var user1 = new User { Username = "user1", Email = "user1@example.com" };
			var user2 = new User { Username = "user2", Email = "user2@example.com" };

			mockRepo.Setup(repo => repo.AddUserAsync(It.IsAny<UserDbModel>())).ReturnsAsync(true);

			var service = new UserService(mockRepo.Object);

			// Act
			var task1 = service.Register(user1);
			var task2 = service.Register(user2);

			var results = await Task.WhenAll(task1, task2);

			// Assert
			Assert.All(results, result => Assert.True(result));
			mockRepo.Verify(repo => repo.AddUserAsync(It.IsAny<UserDbModel>()), Times.Exactly(2));
		}

	}
}

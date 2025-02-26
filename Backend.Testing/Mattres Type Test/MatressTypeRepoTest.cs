using Xunit;
using FakeItEasy;
using FluentAssertions;
using MatCron.Backend.Repositories.Implementations;
using MatCron.Backend.Repositories.Interfaces;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MatCron.Backend.Data;
using MatCron.Backend.Common;

namespace Backend.Testing
{
	public class MattressTypeRepositoryTests
	{
		private readonly ApplicationDbContext _fakeContext;
		private readonly MattressTypeRepository _repository;

		public MattressTypeRepositoryTests()
		{
			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
				.Options;
			
			
			_fakeContext = new ApplicationDbContext(options);
			SeedDatabase(_fakeContext);
			_repository = new MattressTypeRepository(_fakeContext);
		}

		private void SeedDatabase(ApplicationDbContext dbContext)
		{
			// Add mock MattressTypes
			var mattressType1 = new MattressType
			{
				Id = Guid.Parse("123e4567-e89b-12d3-a456-426614174000"),
				Name = "Luxury Foam",
				Width = 60.0,
				Length = 80.0,
				Height = 12.0,
				Composition = "High-density foam",
				Washable = 1,
				RotationInterval = 6.0,
				RecyclingDetails = "Recyclable foam materials",
				ExpectedLifespan = 10.0,
				WarrantyPeriod = 5.0,
				Stock = 25.0
			};

			var mattressType2 = new MattressType
			{
				Id = Guid.NewGuid(),
				Name = "Memory Comfort",
				Width = 54.0,
				Length = 75.0,
				Height = 10.0,
				Composition = "Memory foam with gel layer",
				Washable = 0,
				RotationInterval = 12.0,
				RecyclingDetails = "Partially recyclable",
				ExpectedLifespan = 8.0,
				WarrantyPeriod = 4.0,
				Stock = 15.0
			};

			var mattressType3 = new MattressType
			{
				Id = Guid.NewGuid(),
				Name = "Hybrid Spring",
				Width = 72.0,
				Length = 84.0,
				Height = 14.0,
				Composition = "Foam and pocket spring hybrid",
				Washable = 0,
				RotationInterval = 9.0,
				RecyclingDetails = "Recyclable springs and foam",
				ExpectedLifespan = 12.0,
				WarrantyPeriod = 6.0,
				Stock = 40.0
			};

			var mattressType4 = new MattressType
			{
				Id = Guid.NewGuid(),
				Name = "Basic Foam",
				Width = 39.0,
				Length = 75.0,
				Height = 8.0,
				Composition = "Basic polyurethane foam",
				Washable = 1,
				RotationInterval = 6.0,
				RecyclingDetails = "Non-recyclable",
				ExpectedLifespan = 5.0,
				WarrantyPeriod = 2.0,
				Stock = 30.0
			};

			var mattressType5 = new MattressType
			{
				Id = Guid.NewGuid(),
				Name = "Premium Latex",
				Width = 76.0,
				Length = 80.0,
				Height = 15.0,
				Composition = "100% natural latex",
				Washable = 1,
				RotationInterval = 12.0,
				RecyclingDetails = "Fully recyclable",
				ExpectedLifespan = 15.0,
				WarrantyPeriod = 10.0,
				Stock = 10.0
			};

			dbContext.MattressTypes.AddRange(mattressType1, mattressType2, mattressType3, mattressType4, mattressType5);

			dbContext.SaveChanges();
		}

		[Fact]
		public async Task GetAllMattressTypesAsync_ShouldReturnAllMattressTypes()
		{
			// Arrange
			

			// Act
			var result = await _repository.GetAllMattressTypesAsync();

			// Assert
			result.Should().NotBeNullOrEmpty().And.HaveCount(5);
			
		}

		[Fact]
		public async Task GetMattressTypeByIdAsync_ShouldReturnCorrectMattressType()
		{
			// Arrange
			var id = Guid.Parse("123e4567-e89b-12d3-a456-426614174000");

			// Act
			var result = await _repository.GetMattressTypeByIdAsync(id);

			// Assert
			result.Should().NotBeNull();
			result.Name.Should().Be("Luxury Foam");
		}

		[Fact]
		public async Task AddMattressTypeAsync_ShouldAddMattressTypeSuccessfully()
		{
			// Arrange
			var mattressTypeDto = new MattressTypeDTO {
				Id = Guid.NewGuid(),
				Name = "Latex",
				Width = 72.0,
				Length = 88.0,
				Height = 17.0,
				Composition = "100% natural latex",
				Washable = 1,
				RotationInterval = 12.0,
				RecyclingDetails = "Fully recyclable",
				ExpectedLifespan = 15.0,
				WarrantyPeriod = 10.0,
				Stock = 10.0
			};
			

			// Act
			var result = await _repository.AddMattressTypeAsync(mattressTypeDto);

			// Assert
			
			result.Should().Be("Mattress type added successfully.");
		}

		[Fact]
		public async Task DeleteMattressTypeAsync_ShouldDeleteMattressTypeSuccessfully()
		{
			// Arrange
			var id = Guid.Parse("123e4567-e89b-12d3-a456-426614174000");
		
			

			// Act
			var result = await _repository.DeleteMattressTypeAsync(id);

			// Assert
			
			result.Should().Be("Mattress type deleted successfully.");
		}

		[Fact]
		public async Task EditMattressTypeAsync_ShouldUpdateMattressTypeSuccessfully()
		{
			// Arrange
			var id = Guid.Parse("123e4567-e89b-12d3-a456-426614174000");
			
			var dto = new MattressTypeDTO { Id = id, Name = "Updated Foam", Width = 70, Length = 80, Height = 10, Stock = 20 };

			// Act
			var result = await _repository.EditMattressTypeAsync(dto);

			// Assert
			
			result.Should().Be("Mattress type updated successfully.");
		}
        [Fact]
        public async Task GetAllMattressTypesAsync_ShouldReturnEmptyList_WhenNoMattressTypesExist()
        {
            // Arrange
            _fakeContext.MattressTypes.RemoveRange(_fakeContext.MattressTypes);
            await _fakeContext.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllMattressTypesAsync();

            // Assert
            result.Should().BeEmpty();
        }
        [Fact]
        public async Task GetMattressTypeByIdAsync_ShouldReturnNull_WhenMattressTypeDoesNotExist()
        {
            // Arrange
            var id = Guid.NewGuid();

            // Act
            var result = await _repository.GetMattressTypeByIdAsync(id);

            // Assert
            result.Should().BeNull();
        }
        [Fact]
        public async Task AddMattressTypeAsync_ShouldReturnErrorMessage_WhenNameAlreadyExists()
        {
            // Arrange
            var dto = new MattressTypeDTO
            {
                Id = Guid.NewGuid(),
                Name = "Luxury Foam", // Name already exists in seeded data
                Width = 60.0,
                Length = 80.0,
                Height = 12.0,
                Composition = "High-density foam",
                Washable = 1,
                RotationInterval = 6.0,
                RecyclingDetails = "Recyclable foam materials",
                ExpectedLifespan = 10.0,
                WarrantyPeriod = 5.0,
                Stock = 25.0
            };

            // Act
            var result = await _repository.AddMattressTypeAsync(dto);

            // Assert
            result.Should().Be($"A mattress type with the name '{dto.Name}' already exists.");
        }
        [Fact]
        public async Task AddMattressTypeAsync_ShouldReturnErrorMessage_WhenDimensionsAlreadyExist()
        {
            // Arrange
            var dto = new MattressTypeDTO
            {
                Id = Guid.NewGuid(),
                Name = "New Foam",
                Width = 60.0, // Same dimensions as "Luxury Foam"
                Length = 80.0,
                Height = 12.0,
                Composition = "High-density foam",
                Washable = 1,
                RotationInterval = 6.0,
                RecyclingDetails = "Recyclable foam materials",
                ExpectedLifespan = 10.0,
                WarrantyPeriod = 5.0,
                Stock = 25.0
            };

            // Act
            var result = await _repository.AddMattressTypeAsync(dto);

            // Assert
            result.Should().Be("Mattress type added successfully.");
        }

    }
}
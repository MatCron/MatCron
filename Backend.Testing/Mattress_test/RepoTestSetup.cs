using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Testing.Mattress_test
{
	public class RepoTestSetup
	{
		public static ApplicationDbContext GetInMemoryContext()
		{
			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(Guid.NewGuid().ToString())
				.Options;
			var context = new ApplicationDbContext(options);

			SeedData(context);
			return context;
		}

		private static void SeedData(ApplicationDbContext context)
		{
			var mattressType = new MattressType
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
			var mattresses = new List<Mattress>
		{
			new Mattress
			{
				Uid = Guid.NewGuid(),
				BatchNo = "B123",
				ProductionDate = DateTime.Today.AddDays(-30),
				MattressTypeId = mattressType.Id,
				Status = 1,
				DaysToRotate = 30,
				Location = "Room 101"
			},
			new Mattress
			{
				Uid = Guid.NewGuid(),
				BatchNo = "B124",
				ProductionDate = DateTime.Today.AddDays(-60),
				MattressTypeId = mattressType.Id,
				Status = 2,
				DaysToRotate = 60,
				Location = "Room 102"
			}
		};
			context.MattressTypes.Add(mattressType);
			context.Mattresses.AddRange(mattresses);
			context.SaveChanges();
		}
	}
}

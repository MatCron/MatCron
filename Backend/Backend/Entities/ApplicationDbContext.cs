using Microsoft.EntityFrameworkCore;
using MatCron.Backend.Entities;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSet properties for entities
        public DbSet<User> Users { get; set; }
        public DbSet<Organisation> Organisations { get; set; }
        public DbSet<MattressType> MattressTypes { get; set; }
        public DbSet<Mattress> Mattresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Organisation entity
            modelBuilder.Entity<Organisation>(entity =>
            {
                entity.HasKey(o => o.Id); // Primary Key

                entity.Property(o => o.Name)
                    .IsRequired()
                    .HasMaxLength(100); // Required and max length

                entity.Property(o => o.Email)
                    .HasMaxLength(100); // Optional max length

                entity.Property(o => o.OrganisationCode)
                    .IsRequired()
                    .HasMaxLength(50); // Required and max length
            });

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id); // Primary Key

                entity.Property(u => u.FirstName)
                    .IsRequired()
                    .HasMaxLength(50); // Required field with max length

                entity.Property(u => u.LastName)
                    .IsRequired()
                    .HasMaxLength(50); // Required field with max length

                entity.Property(u => u.Email)
                    .HasMaxLength(100); // Optional max length

                entity.HasOne(u => u.Organisation) // Relationship with Organisation
                    .WithMany(o => o.Users) // One Organisation can have many Users
                    .HasForeignKey(u => u.OrgId) // Foreign Key
                    .OnDelete(DeleteBehavior.Cascade); // Cascade delete
            });

            // Configure MattressType entity
            modelBuilder.Entity<MattressType>(entity =>
            {
                entity.HasKey(mt => mt.Id); // Primary Key

                entity.Property(mt => mt.Name)
                    .IsRequired()
                    .HasMaxLength(100); // Required and max length

                entity.Property(mt => mt.Width)
                    .IsRequired(); // Non-nullable

                entity.Property(mt => mt.Length)
                    .IsRequired(); // Non-nullable

                entity.Property(mt => mt.Height)
                    .IsRequired(); // Non-nullable

                entity.Property(mt => mt.Composition)
                    .IsRequired()
                    .HasMaxLength(500); // Required and max length

                entity.Property(mt => mt.Washable)
                    .IsRequired(); // Non-nullable

                entity.Property(mt => mt.RotationInterval)
                    .IsRequired(); // Non-nullable

                entity.Property(mt => mt.RecyclingDetails)
                    .IsRequired()
                    .HasMaxLength(500); // Required and max length

                entity.Property(mt => mt.ExpectedLifespan)
                    .IsRequired(); // Non-nullable

                entity.Property(mt => mt.WarrantyPeriod)
                    .IsRequired(); // Non-nullable

                entity.HasMany(mt => mt.Mattresses) // One-to-Many relationship
                    .WithOne(m => m.MattressType)
                    .HasForeignKey(m => m.MattressTypeId)
                    .OnDelete(DeleteBehavior.Cascade); // Cascade delete
            });

            // Configure Mattress entity
            modelBuilder.Entity<Mattress>(entity =>
            {
                entity.HasKey(m => m.Uid); // Primary Key

                entity.Property(m => m.BatchNo)
                    .IsRequired(false)
                    .HasMaxLength(50); // Optional max length

                entity.Property(m => m.ProductionDate)
                    .IsRequired(); // Non-nullable

                entity.Property(m => m.EpcCode)
                    .HasMaxLength(100); // Optional max length

                entity.Property(m => m.Status)
                    .IsRequired(); // Non-nullable

                entity.Property(m => m.DaysToRotate)
                    .IsRequired(); // Non-nullable

                entity.Property(m => m.LifeCyclesEnd)
                    .IsRequired(false); // Nullable

                entity.HasOne(m => m.MattressType) // Many-to-One relationship
                    .WithMany(mt => mt.Mattresses)
                    .HasForeignKey(m => m.MattressTypeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(m => m.Group) // Many-to-One relationship with Group
                    .WithMany()
                    .HasForeignKey(m => m.GroupId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(m => m.User) // Many-to-One relationship with User
                    .WithMany()
                    .HasForeignKey(m => m.UserId)
                    .OnDelete(DeleteBehavior.SetNull); // Nullable foreign key
            });
        }
    }
}
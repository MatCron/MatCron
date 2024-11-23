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

        public DbSet<User> Users { get; set; }
        public DbSet<Organisation> Organisations { get; set; }

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
        }
    }
}
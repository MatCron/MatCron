
using Microsoft.EntityFrameworkCore;
using MatCron.Backend.Entities;

namespace MatCron.Backend.Data
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
        public DbSet<Group> Groups { get; set; }
        public DbSet<MattressType> MattressTypes { get; set; }
        public DbSet<Mattress> Mattresses { get; set; }
        public DbSet<MattressGroup> MattressGroups { get; set; }
        public DbSet<LocationMattress> LocationMattresses { get; set; }
        public DbSet<LogMattress> LogMattresses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- Organisation ---
            modelBuilder.Entity<Organisation>(entity =>
            {
                entity.HasKey(o => o.Id);
                entity.Property(o => o.Name).IsRequired().HasMaxLength(100);
                entity.Property(o => o.Email).HasMaxLength(100);
                entity.Property(o => o.OrganisationCode).IsRequired().HasMaxLength(50);
            });

            // --- User ---
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.LastName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Email).HasMaxLength(100);

                entity.HasOne(u => u.Organisation)
                    .WithMany(o => o.Users)
                    .HasForeignKey(u => u.OrgId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(u => u.Group)
                    .WithMany(g => g.Users)
                    .HasForeignKey(u => u.GroupId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

// --- Group ---
            // --- Group ---
            modelBuilder.Entity<Group>(entity =>
            {
                entity.HasKey(g => g.Id);

                entity.Property(g => g.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(g => g.Description)
                    .HasMaxLength(500);

                entity.Property(g => g.Status)
                    .HasConversion<byte>()
                    .IsRequired();

                entity.Property(g => g.CreatedDate)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(g => g.ModifiedDate)
                    .HasDefaultValueSql("NULL");

                // Define relationship for SenderOrgId
                entity.HasOne(g => g.SenderOrganisation)
                    .WithMany()
                    .HasForeignKey(g => g.SenderOrgId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Define relationship for ReceiverOrgId
                entity.HasOne(g => g.ReceiverOrganisation)
                    .WithMany()
                    .HasForeignKey(g => g.ReceiverOrgId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
            
            // --- Mattress ---
            modelBuilder.Entity<Mattress>(entity =>
            {
                entity.HasKey(m => m.Uid);
                entity.Property(m => m.BatchNo).HasMaxLength(50);
                entity.Property(m => m.EpcCode).HasMaxLength(100);

                entity.HasOne(m => m.MattressType)
                    .WithMany(mt => mt.Mattresses)
                    .HasForeignKey(m => m.MattressTypeId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(m => m.Organisation)
                    .WithMany(o => o.Mattresses)
                    .HasForeignKey(m => m.OrgId)
                    .OnDelete(DeleteBehavior.Cascade);

                //entity.HasOne(m => m.Location)
                //    .WithMany(l => l.Mattresses)
                //    .HasForeignKey(m => m.LocationId)
                //    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<MattressGroup>(entity =>
            {
                // Composite primary key
                entity.HasKey(mg => new { mg.MattressId, mg.GroupId });

                entity.Property(mg => mg.DateAssociated)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()"); // or NOW() for Postgres

                entity.HasOne(mg => mg.Mattress)
                    .WithMany(m => m.MattressGroups)
                    .HasForeignKey(mg => mg.MattressId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(mg => mg.Group)
                    .WithMany(g => g.MattressGroups)
                    .HasForeignKey(mg => mg.GroupId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // --- LocationMattress ---
            //modelBuilder.Entity<LocationMattress>(entity =>
            //{
            //    entity.HasKey(l => l.Id);
            //    entity.Property(l => l.Name).IsRequired().HasMaxLength(100);
            //    entity.Property(l => l.Description).HasMaxLength(500);
            //});

            // --- LogMattress ---
            modelBuilder.Entity<LogMattress>(entity =>
            {
                entity.HasKey(l => l.Id);
                entity.Property(l => l.Status).IsRequired().HasMaxLength(50);
                entity.Property(l => l.Details).HasMaxLength(500);

                //entity.HasOne(l => l.Mattress)
                //    .WithMany(m => m.Logs)
                //    .HasForeignKey(l => l.MattressId)
                //    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
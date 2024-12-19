// using Microsoft.EntityFrameworkCore;
// using MatCron.Backend.Entities;
//
// namespace Backend.Data
// {
//     public class ApplicationDbContext : DbContext
//     {
//         public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
//             : base(options)
//         {
//         }
//
//         // DbSet properties for entities
//         public DbSet<User> Users { get; set; }
//         public DbSet<Organisation> Organisations { get; set; }
//         public DbSet<MattressType> MattressTypes { get; set; }
//         // public DbSet<Mattress> Mattresses { get; set; }
//         // public DbSet<Group> Groups { get; set; }
//
//         protected override void OnModelCreating(ModelBuilder modelBuilder)
//         {
//             base.OnModelCreating(modelBuilder);
//             modelBuilder.Entity<MattressType>().ToTable("MattressType");
//
//             // Configure Organisation entity
//             modelBuilder.Entity<Organisation>(entity =>
//             {
//                 entity.HasKey(o => o.Id); // Primary Key
//
//                 entity.Property(o => o.Name)
//                     .IsRequired()
//                     .HasMaxLength(100); // Required and max length
//
//                 entity.Property(o => o.Email)
//                     .HasMaxLength(100); // Optional max length
//
//                 entity.Property(o => o.OrganisationCode)
//                     .IsRequired()
//                     .HasMaxLength(50); // Required and max length
//             });
//
//             // Configure User entity
//             modelBuilder.Entity<User>(entity =>
//             {
//                 entity.HasKey(u => u.Id); // Primary Key
//
//                 entity.Property(u => u.FirstName)
//                     .IsRequired()
//                     .HasMaxLength(50); // Required field with max length
//
//                 entity.Property(u => u.LastName)
//                     .IsRequired()
//                     .HasMaxLength(50); // Required field with max length
//
//                 entity.Property(u => u.Email)
//                     .HasMaxLength(100); // Optional max length
//
//                 entity.HasOne(u => u.Organisation) // Relationship with Organisation
//                     .WithMany(o => o.Users) // One Organisation can have many Users
//                     .HasForeignKey(u => u.OrgId) // Foreign Key
//                     .OnDelete(DeleteBehavior.Cascade); // Cascade delete
//             });
//
//             // Configure MattressType entity
//             modelBuilder.Entity<MattressType>(entity =>
//             {
//                 entity.HasKey(mt => mt.Id); // Primary Key
//
//                 entity.Property(mt => mt.Name)
//                     .IsRequired()
//                     .HasMaxLength(100); // Required and max length
//
//                 entity.Property(mt => mt.Width)
//                     .IsRequired(); // Non-nullable
//
//                 entity.Property(mt => mt.Length)
//                     .IsRequired(); // Non-nullable
//
//                 entity.Property(mt => mt.Height)
//                     .IsRequired(); // Non-nullable
//
//                 entity.Property(mt => mt.Composition)
//                     .IsRequired()
//                     .HasMaxLength(500); // Required and max length
//
//                 entity.Property(mt => mt.Washable)
//                     .IsRequired(); // Non-nullable
//
//                 entity.Property(mt => mt.RotationInterval)
//                     .IsRequired(); // Non-nullable
//
//                 entity.Property(mt => mt.RecyclingDetails)
//                     .IsRequired()
//                     .HasMaxLength(500); // Required and max length
//
//                 entity.Property(mt => mt.ExpectedLifespan)
//                     .IsRequired(); // Non-nullable
//
//                 entity.Property(mt => mt.WarrantyPeriod)
//                     .IsRequired(); // Non-nullable
//                 entity.Property(mt => mt.Stock)
//                     .IsRequired(); 
//
//                 entity.HasMany(mt => mt.Mattresses) // One-to-Many relationship
//                     .WithOne(m => m.MattressType)
//                     .HasForeignKey(m => m.MattressTypeId)
//                     .OnDelete(DeleteBehavior.Cascade);
//             });
//
//             // Configure Mattress entity
//             modelBuilder.Entity<Mattress>(entity =>
//             {
//                 entity.HasKey(m => m.Uid); // Primary Key
//             
//                 entity.Property(m => m.BatchNo)
//                     .HasMaxLength(50); // Optional max length
//             
//                 entity.Property(m => m.ProductionDate)
//                     .IsRequired(); // Non-nullable
//             
//                 entity.Property(m => m.EpcCode)
//                     .HasMaxLength(100); // Optional max length
//             
//                 entity.Property(m => m.Status)
//                     .IsRequired(); // Non-nullable
//             
//                 entity.Property(m => m.DaysToRotate)
//                     .IsRequired(); // Non-nullable
//             
//                 entity.Property(m => m.LifeCyclesEnd)
//                     .IsRequired(false); // Nullable
//             
//                 entity.HasOne(m => m.MattressType) // Many-to-One relationship
//                     .WithMany(mt => mt.Mattresses)
//                     .HasForeignKey(m => m.MattressTypeId)
//                     .OnDelete(DeleteBehavior.Cascade);
//             
//                 entity.HasOne(m => m.Group) // Many-to-One relationship with Group
//                     .WithMany()
//                     .HasForeignKey(m => m.GroupId)
//                     .OnDelete(DeleteBehavior.Cascade);
//             
//                 entity.HasOne(m => m.User) // Many-to-One relationship with User
//                     .WithMany()
//                     .HasForeignKey(m => m.UserId)
//                     .OnDelete(DeleteBehavior.SetNull); // Nullable foreign key
//             });
//             //
//             // modelBuilder.Entity<Group>(entity =>
//             // {
//             //     entity.HasKey(g => g.Id); // Primary Key
//             //
//             //     entity.Property(g => g.Status).IsRequired(false); // Nullable Status
//             //
//             //     entity.HasOne(g => g.Organisation)
//             //         .WithMany(o => o.Groups)
//             //         .HasForeignKey(g => g.OrgId)
//             //         .OnDelete(DeleteBehavior.Cascade);
//             //
//             //     entity.HasMany(g => g.Users)
//             //         .WithOne()
//             //         .HasForeignKey(u => u.Id)
//             //         .OnDelete(DeleteBehavior.Cascade);
//             //
//             //     entity.HasMany(g => g.Mattresses)
//             //         .WithOne(m => m.Group)
//             //         .HasForeignKey(m => m.GroupId)
//             //         .OnDelete(DeleteBehavior.Cascade);
//             // });
//             
//             
//
//         }
//     }
// }


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

            // --- Organisation Configuration ---
            modelBuilder.Entity<Organisation>(entity =>
            {
                entity.HasKey(o => o.Id);

                entity.Property(o => o.Name).IsRequired().HasMaxLength(100);
                entity.Property(o => o.Email).HasMaxLength(100);
                entity.Property(o => o.Description).HasMaxLength(500);
                entity.Property(o => o.OrganisationType).HasMaxLength(50);
                entity.Property(o => o.RegistrationNo).HasMaxLength(100);
            });

            // --- User Configuration ---
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);

                entity.Property(u => u.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.LastName).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Email).HasMaxLength(100);
            });

            // --- Group Configuration ---
            modelBuilder.Entity<Group>(entity =>
            {
                entity.HasKey(g => g.Id);

                entity.Property(g => g.ContactNumber).HasMaxLength(50);
           
            });

            // --- Mattress Configuration ---
            modelBuilder.Entity<Mattress>(entity =>
            {
                entity.HasKey(m => m.Uid);

                entity.Property(m => m.BatchNo).HasMaxLength(50);
                entity.Property(m => m.EpcCode).HasMaxLength(100);
                entity.Property(m => m.Status).IsRequired();
            });

            // --- MattressType Configuration ---
            modelBuilder.Entity<MattressType>(entity =>
            {
                entity.HasKey(mt => mt.Id);

                entity.Property(mt => mt.Name).IsRequired().HasMaxLength(100);
                entity.Property(mt => mt.Composition).HasMaxLength(500);
                entity.Property(mt => mt.RecyclingDetails).HasMaxLength(500);
            });

            // --- LocationMattress Configuration ---
            modelBuilder.Entity<LocationMattress>(entity =>
            {
                entity.HasKey(l => l.Id);

                entity.Property(l => l.Name).IsRequired().HasMaxLength(100);
                entity.Property(l => l.Description).HasMaxLength(500);
            });

            // --- LogMattress Configuration ---
            modelBuilder.Entity<LogMattress>(entity =>
            {
                entity.HasKey(l => l.Id);

                entity.Property(l => l.Status).IsRequired().HasMaxLength(50);
                entity.Property(l => l.Details).HasMaxLength(500);
                entity.Property(l => l.Type).IsRequired().HasMaxLength(50);
            });

            // --- MattressGroup Configuration (Many-to-Many) ---
            modelBuilder.Entity<MattressGroup>(entity =>
            {
                entity.HasKey(mg => new { mg.MattressId, mg.GroupId });
            });
        }
    }
}
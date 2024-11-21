using System.Text.Json.Serialization;

namespace MatCron.Backend.Entities
{
    public class Organisation
    {
        public int Id { get; set; } // Primary Key
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Description { get; set; }
        public string? PostalAddress { get; set; }
        public string? NormalAddress { get; set; }
        public string? WebsiteLink { get; set; }
        public string? Logo { get; set; }
        public string? RegistrationNo { get; set; }
        public string? OrganisationType { get; set; }
        public string? OrganisationCode { get; set; }

        

        // Navigation Property
        public ICollection<User> Users { get; set; } // Organisation has many Users
    }
}
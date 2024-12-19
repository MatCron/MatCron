﻿using System.Collections.Generic;

namespace MatCron.Backend.Entities
{
    public class Organisation
    {
        public Guid Id { get; set; } 
        public string? Name { get; set; } 
        public string? Email { get; set; } 
        public string? Description { get; set; } 
        public string? PostalAddress { get; set; } 
        public string? NormalAddress { get; set; } 
        public string? WebsiteLink { get; set; } 
        public string? Logo { get; set; } 
        public string? RegistrationNo { get; set; } 
        public string? OrganisationType { get; set; } //category 
        public string OrganisationCode { get; set; } 

        // Navigation Property
        public ICollection<User> Users { get; set; } // Organisation has many Users
        public ICollection<Mattress> Mattresses { get; set; } = new List<Mattress>();
        public ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}
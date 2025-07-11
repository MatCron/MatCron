﻿namespace Backend.DTOs.Organisation
{
    public class OrganisationDTO
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Description { get; set; }
        public string? PostalAddress { get; set; }
        public string? NormalAddress { get; set; }
        public string? Eir { get; set; }
        public string? County { get; set; }
        public string? WebsiteLink { get; set; }
        public string? Logo { get; set; }
        public string? RegistrationNo { get; set; }
        public byte? OrganisationType { get; set; }
        public string? OrganisationCode { get; set; }
    }
}

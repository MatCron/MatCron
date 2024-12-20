using MatCron.Backend.Repositories.Interfaces;

using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;
using MatCron.Backend.Common;
using Microsoft.EntityFrameworkCore;
using System;
using Backend.Repositories.Interfaces;
using MatCron.Backend.Data;


namespace MatCron.Backend.Repositories.Implementations
{
    public class GroupRepository : IGroupRepository
    {
        private readonly ApplicationDbContext _context;

        public GroupRepository(ApplicationDbContext context)
        {
            _context = context;
        }


    }
}
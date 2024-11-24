using Backend.Common.Enums;
using MatCron.Backend.DTOs;
using MatCron.Backend.Entities;

namespace MatCron.Backend.Common
{
    public static class Converter
    {

        public static User ConvertToUser(RegistrationRequestDto dto, Guid organisationId)
        {
            if (dto == null)
            {
                return null;
            }

            return new User
            {   Id = Guid.NewGuid(),
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                Password = dto.Password, 
                OrgId = organisationId,
                UserType = (byte)UserTypeEnum.Employee,
                EmailVerified = (byte)EmailStatus.Pending
            };
        }
    }
}
using Backend.DTOs.User;
using MatCron.Backend.Entities;

namespace Backend.Common.Converters
{
    public class UserConverter
    {
        public static UserDto ConvertToUserDto(User user)
        {
            if (user == null)
            {
                return null;
            }

            return new UserDto
            {
                Id = user.Id.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                UserType = user.UserType.ToString()
            };
        }
    }
}

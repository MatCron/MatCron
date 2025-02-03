using Backend.DTOs.User;

namespace Backend.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<UserDto> GetUserByIdAsync(string id);
        Task<UserDto> GetUserByEmailAsync(string email);

        Task<UserDto> UpdateUserAsync(UserDto userDto);

        Task<bool> DeleteUser(string id);
    }
}

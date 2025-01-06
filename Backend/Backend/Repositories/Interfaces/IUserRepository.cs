using Backend.DTOs.User;

namespace Backend.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<UserDto> GetUserByIdAsync(string id);
        Task<UserDto> GetUserByEmailAsync(string email);

        void UpdateUserAsync(UserDto userDto);

        void DeleteUser(string id);
    }
}

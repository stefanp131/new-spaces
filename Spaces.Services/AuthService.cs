
using Spaces.Data.Entities;
using Spaces.Data.UnitOfWork;
using Spaces.Data.Repositories;

namespace Spaces.Services;

public interface IAuthService
{
    Task<User?> AuthenticateAsync(string username, string password);
    Task<User> RegisterAsync(string username, string password);
}

public class AuthService : IAuthService
{

    private readonly IUnitOfWork _unitOfWork;
    public AuthService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }


    public async Task<User?> AuthenticateAsync(string username, string password)
    {
        var users = await _unitOfWork.Users.FindAsync(u => u.Username == username);
        var user = users.FirstOrDefault();
        if (user == null) return null;
        if (!VerifyPassword(password, user.PasswordHash)) return null;
        return user;
    }


    public async Task<User> RegisterAsync(string username, string password)
    {
        var passwordHash = HashPassword(password);
        var user = new User { Username = username, PasswordHash = passwordHash };
        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();
        return user;
    }

    // Simple password hashing using SHA256 (for demo; use a stronger method in production)
    private static string HashPassword(string password)
    {
        using var sha = System.Security.Cryptography.SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(password);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private static bool VerifyPassword(string password, string hash)
    {
        return HashPassword(password) == hash;
    }
}

using Spaces.Data;
using Microsoft.EntityFrameworkCore;

namespace Spaces.Services;

public interface IAuthService
{
    Task<User?> AuthenticateAsync(string username, string password);
    Task<User> RegisterAsync(string username, string password);
}

public class AuthService : IAuthService
{
    private readonly SpacesDbContext _db;
    public AuthService(SpacesDbContext db)
    {
        _db = db;
    }

    public async Task<User?> AuthenticateAsync(string username, string password)
    {
    // For demo: no password hashing, just match username/password
    return await _db.Users.FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == password);
    }

    public async Task<User> RegisterAsync(string username, string password)
    {
    var user = new User { Username = username, PasswordHash = password };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return user;
    }
}

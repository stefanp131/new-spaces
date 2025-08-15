using Microsoft.EntityFrameworkCore;

namespace Spaces.Data
{
    public class SpacesDbContext : DbContext
    {
        public SpacesDbContext(DbContextOptions<SpacesDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
    }

    public class User
    {
        public int Id { get; set; }
    public required string Username { get; set; }
    public required string PasswordHash { get; set; }
    }
}

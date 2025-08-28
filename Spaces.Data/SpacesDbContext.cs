using Microsoft.EntityFrameworkCore;
using Spaces.Data.Entities;

namespace Spaces.Data
{
    public class SpacesDbContext : DbContext
    {
        public SpacesDbContext(DbContextOptions<SpacesDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Message> Messages { get; set; }
    }
}

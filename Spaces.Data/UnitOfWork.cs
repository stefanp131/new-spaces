using System.Threading.Tasks;
using Spaces.Data.Entities;
using Spaces.Data.Repositories;

namespace Spaces.Data.UnitOfWork
{
    public interface IUnitOfWork
    {
    IRepository<User> Users { get; }
    IRepository<Post> Posts { get; }
        Task<int> SaveChangesAsync();
    }

    public class UnitOfWork : IUnitOfWork
    {
        private readonly SpacesDbContext _context;
    private IRepository<User>? _users;
    private IRepository<Post>? _posts;

        public UnitOfWork(SpacesDbContext context)
        {
            _context = context;
        }

        public IRepository<User> Users => _users ??= new Repository<User>(_context);
    public IRepository<Post> Posts => _posts ??= new Repository<Post>(_context);

        public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();
    }
}

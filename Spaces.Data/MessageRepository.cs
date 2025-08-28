using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Spaces.Data.Repositories
{
    public interface IMessageRepository
    {
        Task<IEnumerable<Message>> GetMessagesForUserAsync(int userId);
        Task AddMessageAsync(Message message);
        Task MarkAllAsReadAsync(int userId);
    }

    public class MessageRepository : IMessageRepository
    {
        private readonly SpacesDbContext _context;
        public MessageRepository(SpacesDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Message>> GetMessagesForUserAsync(int userId)
        {
            return await _context.Messages
                .AsNoTracking()
                .Where(m => m.RecipientId == userId || m.SenderId == userId)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();
        }

        public async Task AddMessageAsync(Message message)
        {
            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();
        }

        public async Task MarkAllAsReadAsync(int userId)
        {
            var messages = await _context.Messages
                .Where(m => m.RecipientId == userId && !m.IsRead)
                .ToListAsync();
            foreach (var msg in messages)
            {
                msg.IsRead = true;
            }
            await _context.SaveChangesAsync();
        }
    }
}

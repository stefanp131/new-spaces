using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Spaces.Data.Repositories
{
    public interface IMessageRepository
    {
        Task<IEnumerable<Message>> GetMessagesForUserAsync(int userId);
        Task<IEnumerable<Message>> GetMessagesBetweenUsersAsync(int userId, int recipientId);
        Task AddMessageAsync(Message message);
    Task MarkAllAsReadAsync(int userId);
    Task MarkAllAsReadWithRecipientAsync(int userId, int recipientId);
    }

    public class MessageRepository : IMessageRepository
    {
        private readonly SpacesDbContext _context;
        public MessageRepository(SpacesDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Message>> GetMessagesBetweenUsersAsync(int userId, int recipientId)
        {
            return await _context.Messages
                .AsNoTracking()
                .Where(m => (m.SenderId == userId && m.RecipientId == recipientId) || (m.SenderId == recipientId && m.RecipientId == userId))
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();
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

        public async Task MarkAllAsReadWithRecipientAsync(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Where(m => m.RecipientId == userId && m.SenderId == recipientId && !m.IsRead)
                .ToListAsync();
            foreach (var msg in messages)
            {
                msg.IsRead = true;
            }
            await _context.SaveChangesAsync();
        }
    }
}

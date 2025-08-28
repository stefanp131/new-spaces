using System.Collections.Generic;
using System.Threading.Tasks;
using Spaces.Data;
using Spaces.Data.Repositories;

namespace Spaces.Services
{
    public interface IMessageService
    {
        Task<IEnumerable<Message>> GetMessagesForUserAsync(int userId);
        Task AddMessageAsync(Message message);
        Task MarkAllAsReadAsync(int userId);
    }

    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        public MessageService(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        public async Task<IEnumerable<Message>> GetMessagesForUserAsync(int userId)
        {
            return await _messageRepository.GetMessagesForUserAsync(userId);
        }

        public async Task AddMessageAsync(Message message)
        {
            await _messageRepository.AddMessageAsync(message);
        }

        public async Task MarkAllAsReadAsync(int userId)
        {
            await _messageRepository.MarkAllAsReadAsync(userId);
        }
    }
}

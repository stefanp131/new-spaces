using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using Spaces.Services;
using Spaces.Data;
using System.Threading.Tasks;
using System.Security.Claims;

namespace Spaces.API.Hubs
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IMessageService _messageService;
        public MessageHub(IMessageService messageService)
        {
            _messageService = messageService;
        }

        public async Task SendMessageToUser(int recipientId, Message message)
        {
            // Save message to DB
            await _messageService.AddMessageAsync(message);
            // Send to recipient
            await Clients.User(recipientId.ToString()).SendAsync("ReceiveMessage", message);
            // Optionally, send to sender for confirmation
            await Clients.User(message.SenderId.ToString()).SendAsync("ReceiveMessage", message);
        }

        public async Task RequestMessagesWithRecipient(int userId, int recipientId)
        {
            var messages = await _messageService.GetMessagesBetweenUsersAsync(userId, recipientId);
            await Clients.User(userId.ToString()).SendAsync("RequestMessagesWithRecipient", messages);
        }
    }
}

using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace csharp_app.Hubs
{
    public class NotificationHub : Hub
    {
        [HubMethodName("JoinGroup")]
        public async Task JoinGroup(string groupName)
        {
            if (!string.IsNullOrWhiteSpace(groupName) && groupName.Length > 2)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            }
        }

        [HubMethodName("LeaveGroup")]
        public async Task LeaveGroup(string groupName)
        {
            if (!string.IsNullOrWhiteSpace(groupName) && groupName.Length > 2)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            }
        }
    }
}

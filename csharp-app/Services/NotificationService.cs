using csharp_app.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Azure.SignalR.Management;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace csharp_app.Services
{
    public class NotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendMessage(string group, string target, string message)
        {
            await _hubContext.Clients.Group(group).SendAsync(target, message);
        }
    }
}

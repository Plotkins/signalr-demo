using csharp_app.Hubs;
using csharp_app.Models;
using csharp_app.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace csharp_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectController : ControllerBase
    {
        private NotificationService _notificationService;
        private readonly ILogger<ProjectController> _logger;
        private static readonly string[] Projects = new[]
        {
            "Jira DC", "My Play",
        };

        public ProjectController(NotificationService notificationService, ILogger<ProjectController> logger)
        {
            _logger = logger;
            _notificationService = notificationService;
        }

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return Projects;
        }

        [HttpPost]
        public async Task AddTask([FromBody]AddTaskRequest request)
        {
            await _notificationService.SendMessage(request.Project, "AddTask", request.Task);
        }
    }
}

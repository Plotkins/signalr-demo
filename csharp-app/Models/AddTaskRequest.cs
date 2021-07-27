using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace csharp_app.Models
{
    public class AddTaskRequest
    {
        public string Project { get; set; }
        public string Task { get; set; }
    }
}

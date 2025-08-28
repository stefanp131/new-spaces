using Microsoft.AspNetCore.Mvc;
using Spaces.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Spaces.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly SpacesDbContext _context;

        public UsersController(SpacesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = _context.Users.Select(u => new { u.Id, u.Username }).ToList();
            return Ok(users);
        }
    }
}

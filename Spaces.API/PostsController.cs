using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Spaces.Data;
using Spaces.Services;
using Spaces.Services.DTOs;
using System.Security.Claims;

namespace Spaces.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;
        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePost([FromBody] PostCreateDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            var created = await _postService.CreatePostAsync(int.Parse(userId), dto);
            return Ok(created);
        }


        [HttpGet]
        public async Task<IActionResult> GetAllPosts()
        {
            var posts = await _postService.GetAllPostsAsync();
            return Ok(posts);
        }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetAllPostsByUser(int userId)
        {
            var posts = await _postService.GetAllPostsByUserAsync(userId);
            return Ok(posts);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            var success = await _postService.DeletePostAsync(id, int.Parse(userId));
            if (!success) return NotFound();
            return NoContent();
        }
    }
}

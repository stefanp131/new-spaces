using Spaces.Data;
using Spaces.Data.UnitOfWork;
using Spaces.Services.DTOs;
using AutoMapper;

namespace Spaces.Services
{
    public interface IPostService
    {
    Task<PostReadDto> CreatePostAsync(int userId, PostCreateDto dto);
    Task<IEnumerable<PostReadDto>> GetAllPostsAsync();
    Task<IEnumerable<PostReadDto>> GetAllPostsByUserAsync(int userId);
    Task<bool> DeletePostAsync(int id, int userId);
    }

    public class PostService : IPostService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        public PostService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<PostReadDto> CreatePostAsync(int userId, PostCreateDto dto)
        {
            var entity = _mapper.Map<Post>(dto);
            entity.UserId = userId;
            await _unitOfWork.Posts.AddAsync(entity);
            await _unitOfWork.SaveChangesAsync();
            return _mapper.Map<PostReadDto>(entity);
        }


        public async Task<IEnumerable<PostReadDto>> GetAllPostsAsync()
        {
            var all = await _unitOfWork.Posts.GetAllAsync();
            return _mapper.Map<IEnumerable<PostReadDto>>(all);
        }

        public async Task<IEnumerable<PostReadDto>> GetAllPostsByUserAsync(int userId)
        {
            var userPosts = await _unitOfWork.Posts.GetAllByUserAsync(userId);
            return _mapper.Map<IEnumerable<PostReadDto>>(userPosts);
        }

        public async Task<bool> DeletePostAsync(int id, int userId)
        {
            var post = await _unitOfWork.Posts.GetByIdAsync(id);
            if (post == null) return false; // not found
            if (post.UserId != userId) return false; // ownership mismatch (controller will decide response)
            _unitOfWork.Posts.Remove(post);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}

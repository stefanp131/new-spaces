using Spaces.Data;
using Spaces.Data.UnitOfWork;
using Spaces.Data.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using Spaces.Services.DTOs;
using AutoMapper;

namespace Spaces.Services
{
    public interface IPostService
    {
        Task<PostReadDto> CreatePostAsync(int userId, PostCreateDto dto);
        Task<IEnumerable<PostReadDto>> GetAllPostsAsync();
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
    }
}

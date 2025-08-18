using AutoMapper;
using Spaces.Data;
using Spaces.Services.DTOs;

namespace Spaces.Services.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<PostCreateDto, Post>();
            CreateMap<Post, PostReadDto>();
        }
    }
}

using Spaces.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Logging;

var builder = WebApplication.CreateBuilder(args);
// Add controllers
builder.Services.AddControllers();
// Add CORS policy for Angular dev server
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowAngularDev",
		policy => policy
			.WithOrigins("http://localhost:4200")
			.AllowAnyHeader()
			.AllowAnyMethod()
			.AllowCredentials()
	);
});
// Add DbContext for PostgreSQL
builder.Services.AddDbContext<SpacesDbContext>(options =>
	options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register AuthService
builder.Services.AddScoped<Spaces.Data.UnitOfWork.IUnitOfWork, Spaces.Data.UnitOfWork.UnitOfWork>();
builder.Services.AddScoped<Spaces.Services.IAuthService, Spaces.Services.AuthService>();
builder.Services.AddScoped<Spaces.Services.IPostService, Spaces.Services.PostService>();
// AutoMapper (scan services assembly for profiles)
builder.Services.AddAutoMapper(typeof(Spaces.Services.Mapping.MappingProfile).Assembly);

// JWT configuration
var jwtSettings = builder.Configuration.GetSection("Jwt");
var tokenValidationParameters = new TokenValidationParameters
{
	ValidateIssuer = true,
	ValidateAudience = true,
	ValidateLifetime = true,
	ValidateIssuerSigningKey = true,
	ValidIssuer = jwtSettings["Issuer"]!,
	ValidAudience = jwtSettings["Audience"]!,
	IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!)),
	ClockSkew = TimeSpan.Zero
};
builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
	options.RequireHttpsMetadata = false; // keep HTTP for local dev
	options.TokenValidationParameters = tokenValidationParameters;
	// No logging events
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    IdentityModelEventSource.ShowPII = true;
}

app.UseCors("AllowAngularDev");

app.UseAuthentication();
app.UseAuthorization();

// Map controllers AFTER auth middleware registration so pipeline flows correctly
app.MapControllers();

app.Run();

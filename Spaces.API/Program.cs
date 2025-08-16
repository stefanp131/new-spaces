using Spaces.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

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

// JWT configuration
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = true,
		ValidateAudience = true,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
	ValidIssuer = jwtSettings["Issuer"]!,
	ValidAudience = jwtSettings["Audience"]!,
	IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
	};
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Map controller routes
app.MapControllers();

// Use CORS before authentication/authorization
app.UseCors("AllowAngularDev");

app.UseAuthentication();
app.UseAuthorization();


app.MapGet("/", [Authorize]() => "Hello World! (JWT protected)");

app.Run();

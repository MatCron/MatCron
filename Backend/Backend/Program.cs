
using Backend.Data;
using MatCron.Backend.Repositories.Implementations;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.Middlewares;
using Backend.Common.Utilities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddSingleton<JwtUtils>();

// JWT Configuration
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT configuration is missing in appsettings.json.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Database Context
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting(); // Must come before custom middleware
app.UseJwtMiddleware(); // Custom JWT middleware
app.UseAuthentication(); // Built-in authentication middleware
app.UseAuthorization();

app.MapControllers();

app.Run();
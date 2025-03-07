
using MatCron.Backend.Repositories.Implementations;
using MatCron.Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using MatCron.Backend.Repositories.Interfaces;
using MatCron.Backend.Repositories.Implementations;
using Microsoft.Extensions.Configuration;
using Backend.Middlewares;
using Backend.Common.Utilities;

using Backend.Repositories.Interfaces;
using MatCron.Backend.Entities;
using Backend.Repositories;
using MatCron.Backend.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSingleton<JwtUtils>();


// CORS Configuration - Allow All Origins for time being 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()  // Allows all origins
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

//Jwt configuration starts here
var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<String>();
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<String>();
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



builder.Services.AddScoped<IUserRepository, UserRepository>()
    .AddScoped<IOrganisationRepository, OrganisationRepository>()
    .AddScoped<IMattressTypeRepository, MattressTypeRepository>()
  .AddScoped<IMattressRepository, MattressRepository>()
    .AddScoped<ILogRepository,LogRepository>()
  .AddScoped<INotificationRepository, NotificationRepository>()
    .AddScoped<IAuthRepository, AuthRepository>().AddScoped<IGroupRepository, GroupRepository>();
builder.Services.AddControllers();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();




// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    //options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
    options.UseMySql(
        builder.Configuration.GetConnectionString("MySQLConnection"),
        new MySqlServerVersion(new Version(8, 0, 30)) // Replace with your MySQL version
    ));






var app = builder.Build();

// Configure the HTTP request pipeline.
// testing phase for us to see the api
if (true)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseJwtMiddleware();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

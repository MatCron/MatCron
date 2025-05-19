using System.Threading.Tasks;
using Backend.Common.Utilities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using MatCron.Backend.Data;
using MatCron.Backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.Middlewares
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtUtils _jwtUtils;
        private readonly IServiceProvider _serviceProvider;
        
        public JwtMiddleware(RequestDelegate next, JwtUtils jwtUtils, IServiceProvider serviceProvider)
        {
            _next = next;
            _jwtUtils = jwtUtils ?? throw new ArgumentNullException(nameof(jwtUtils));
            _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
        }

        public async Task Invoke(HttpContext httpContext)
        {
            // Get the Authorization header
            string? token = httpContext.Request.Headers["Authorization"]
                .FirstOrDefault()?.Split(" ")[1];

            if (string.IsNullOrEmpty(token))
            {
                // Allow specific routes to bypass authorization
                if (IsEnabledUnauthorizedRoute(httpContext))
                {
                    await _next(httpContext);
                    return;
                }

                // If not allowed, return 401 Unauthorized
                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await httpContext.Response.WriteAsync("Unauthorized: Token is missing.");
                return;
            }

            // Validate the token
            var (principal, error) = _jwtUtils.ValidateToken(token);

            if (principal != null)
            {
                // Attach claims to HttpContext.User
                var userId = principal.Claims.FirstOrDefault(c => c.Type == "Id")?.Value;
                var orgId = principal.Claims.FirstOrDefault(c => c.Type == "OrgId")?.Value;
                var email = principal.Claims.FirstOrDefault(c => c.Type == "Email")?.Value;
                
                httpContext.User = principal;
                
                try
                {
                    // Create a scope for this request to resolve the DbContext
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                        
                        User user = await context.Users.Include(u=>u.Organisation)
                            .SingleOrDefaultAsync(u=>u.Id == Guid.Parse(userId));
                            
                        if (user == null)
                        {
                            httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            await httpContext.Response.WriteAsync("Unauthorized: Token invalid. Please contact Admin.");
                            return;
                        }

                        if(user.Organisation.Id != Guid.Parse(orgId) || user.Email != email)
                        {
                            httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            await httpContext.Response.WriteAsync("Unauthorized: Token invalid. Please contact Admin.");
                            return;
                        }
                    }
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await httpContext.Response.WriteAsync("Unauthorized:Token Error. Please Contact Admin.");
                    return;
                }
            }
            else
            {
                // Log the error and return 401 Unauthorized
                Console.WriteLine($"Token validation failed: {error}");
                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await httpContext.Response.WriteAsync($"Unauthorized: {error}");
                return;
            }

            // Call the next middleware in the pipeline
            await _next(httpContext);
        }

        private bool IsEnabledUnauthorizedRoute(HttpContext httpContext)
        {
            // Customize this logic as needed to allow unauthorized routes
            List<string> enabledRoutes = new List<string>
            {
                "/api/auth/login",
                "/api/auth/register",
                "/api/auth/verify-encryptiondata",
                "/api/auth/complete-registration",    
                "/api/test/getteapot",
                "/swagger",
                "/swagger/index.html",
                "/swagger/v1/swagger.json",
                "/api/test/test-token"
            };

            var requestPath = httpContext.Request.Path.Value?.TrimEnd('/').ToLower();
            
            // Check if the path starts with any of the enabled routes
            return enabledRoutes.Any(route => requestPath?.StartsWith(route.ToLower()) == true);
        }
    }

    // Extension method to add middleware to the pipeline
    public static class JwtMiddlewareExtensions
    {
        public static IApplicationBuilder UseJwtMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JwtMiddleware>();
        }
    }
}
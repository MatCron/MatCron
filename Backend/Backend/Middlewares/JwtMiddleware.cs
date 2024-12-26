using System.Threading.Tasks;
using Backend.Common.Utilities;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Middlewares
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JwtUtils _jwtUtils;

        public JwtMiddleware(RequestDelegate next, JwtUtils jwtUtils)
        {
            _next = next;
            _jwtUtils = jwtUtils ?? throw new ArgumentNullException(nameof(jwtUtils));
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
                httpContext.User = principal;
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
                "/api/test/getteapot",
                "/swagger/index.html",
                "/api/test/test-token"
            };

            var requestPath = httpContext.Request.Path.Value?.TrimEnd('/').ToLower();
            return enabledRoutes.Contains(requestPath);
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

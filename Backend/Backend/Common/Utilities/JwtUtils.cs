using Backend.Common.Enums;
using MatCron.Backend.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Common.Utilities
{
    public class JwtUtils
    {

        private readonly IConfiguration _config;
        public JwtUtils(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateJwtToken(User user)
        {
            if(user == null)
            {
                Console.WriteLine("User is null");
                return "User is null";
            }

           
            if(this._config == null)
            {
                Console.WriteLine("Configuration is null");
                return "Configuration is null";
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);


            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub,Convert.ToString(user.Id)),
                new Claim("Id", user.Id.ToString()),
                new Claim("Email", user.Email ?? ""),
                new Claim("UserType", user.UserType != null ? user.UserType.ToString() : ""),
                new Claim("OrgId", user.OrgId != null ? user.OrgId.ToString() : "org is null")
            };
            var Sectoken = new JwtSecurityToken(this._config["Jwt:Issuer"],
                this._config["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: credentials);

            var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);
            return token;
            
        }

        public (ClaimsPrincipal? Principal, string? Error) ValidateToken(string token)
        {
            try
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._config["Jwt:Key"]));
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = this._config["Jwt:Issuer"],
                    ValidAudience = this._config["Jwt:Issuer"],
                    IssuerSigningKey = securityKey
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);

                if (validatedToken is JwtSecurityToken jwtToken)
                {
                    return (principal, null); // Token is valid, no error
                }

                return (null, "Invalid token structure.");
            }
            catch (SecurityTokenExpiredException)
            {
                return (null, "Token has expired.");
            }
            catch (SecurityTokenException ex)
            {
                return (null, $"Token validation failed: {ex.Message}");
            }
            catch (Exception ex)
            {
                return (null, $"Unexpected error: {ex.Message}");
            }
        }


    }
}

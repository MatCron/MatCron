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
                return "User is null";
            }

            try
            {
                if(this._config == null)
                {
                    return "Configuration is null";
                }

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);


                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub,Convert.ToString(user.Id)),
                    new Claim("Email", user.Email),
                    new Claim("UserType", user.UserType.ToString()),
                    new Claim("OrgId", Convert.ToString(user.OrgId))
                };

                var Sectoken = new JwtSecurityToken(this._config["Jwt:Issuer"],
                  this._config["Jwt:Issuer"],
                  claims: claims,
                  expires: DateTime.Now.AddDays(7),
                  signingCredentials: credentials);

                var token = new JwtSecurityTokenHandler().WriteToken(Sectoken);

                return token;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
           
    }
}

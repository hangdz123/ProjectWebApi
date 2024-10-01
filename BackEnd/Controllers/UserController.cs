using BackEnd.DataDto;
using BackEnd.Entities;
using BackEnd.IServices;
using BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackEnd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserServices userServies;
        private readonly AppDbContext dbContext;

        public UserController(IConfiguration configuration)
        {
            userServies = new UserServices();
            _configuration = configuration;
            dbContext = new AppDbContext();
        }
        //[Authorize(Roles = "Admin, User")]
        [HttpGet]
        [Route("GetUserById")]
        public IActionResult GetUserById(int Id)
        {
            var query = userServies.GetUserById(Id);
            return Ok(query);
        }
        [HttpGet]
        [Route("GetUser")]
        public IActionResult GetUser(string email)
        {
            var query = userServies.KiemTraEmail2(email);
            return Ok(query);
        }
        //[Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("GetAllUser")]
        public IActionResult GetAllUser()
        {
            var query = userServies.GetAllUser();
            return Ok(query);
        }
        [HttpPost]
        [Route("CreateUser")]
        public async Task<dynamic> Create([FromForm] UserDto dto, IFormFile? imageFile)
        {
            if (userServies.KiemTraEmail(dto.Email) == true)
            {
                string passwordHash = userServies.GetSHA256Hash(dto.Password);
                // Lấy đường dẫn wwwroot của Project B từ cấu hình
                var projectBWebRootPath = _configuration["Paths:WebRootPath"];
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), projectBWebRootPath, "upload");

                User user = new User
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    Password = passwordHash,
                    Gender = dto.Gender,
                    Address = dto.Address,
                    Phone = dto.Phone,
                    RoleId = 2
                };
                userServies.Create(user);
                // Lưu file ảnh vào thư mục wwwroot của Project B
                if (imageFile != null && imageFile.Length > 0)
                {
                    string imagePath = Path.Combine(fullPath, "Img_" + user.Id + Path.GetExtension(imageFile.FileName));
                    using (var stream = new FileStream(imagePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }
                    user.Image = "Img_" + user.Id + Path.GetExtension(imageFile.FileName);
                }
                dbContext.Update(user);
                dbContext.SaveChanges();
                return user;
            }
            return BadRequest("Email bị trùng");
        }
        [HttpPost]
        [Route("UpdateUser")]
        public async Task<dynamic> Update([FromForm] UserDto dto, IFormFile? imageFile)
        {
            //Kiểm tra user có tồn tại không
            var user = userServies.GetUserById(dto.Id);
            if (user == null)
            {
                return BadRequest("User không tồn tại");
            }

            //if (userServies.KiemTraEmail(dto.Email) == true )
            if (dto.Email == user.Email)
            {
                string passwordHash = userServies.GetSHA256Hash(dto.Password);
                var projectBWebRootPath = _configuration["Paths:WebRootPath"];
                var fullPath = Path.Combine(Directory.GetCurrentDirectory(), projectBWebRootPath, "upload");

                user.Id = dto.Id;
                user.Name = dto.Name;
                user.Email = dto.Email;
                user.Password = passwordHash;
                user.Gender = dto.Gender;
                user.Address = dto.Address;
                user.Phone = dto.Phone;
                user.RoleId = 2;
                
                if (imageFile != null && imageFile.Length > 0)
                {
                    string imagePath = Path.Combine(fullPath, "Img_" + user.Id + Path.GetExtension(imageFile.FileName));
                    using (var stream = new FileStream(imagePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }
                    user.Image = "Img_" + user.Id + Path.GetExtension(imageFile.FileName);
                }

                userServies.Update(user);
                return user;
            }
            return BadRequest("Email bị trùng với người dùng khác");
        }
        [HttpDelete]
        [Route("DeleteUser")]
        public async Task<dynamic> Delete(int id)
        {
            var searchUser = userServies.GetUserById(id);
            if (searchUser != null)
            {
                dbContext.Remove(searchUser);
                dbContext.SaveChanges();
                return Ok();
            }
            return BadRequest("Người dùng không tồn tại");
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("Login")]
        public async Task<dynamic> Login([FromBody] Login login)
        {
            string passwordHash = userServies.GetSHA256Hash(login.Password);

            var user = await userServies.Login(login.Email, passwordHash);

            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            var tokenString = GenerateJwtToken(user.Email, user.Id.ToString(), user.RoleId == 1 ? "Admin" : "User");
            SetTokenCookie(tokenString);
            return Ok(new { Token = tokenString });
        }
        private string GenerateJwtToken(string email, string userId, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Email, email),
                    new Claim(JwtRegisteredClaimNames.Sid, userId),
                    new Claim(ClaimTypes.Role, role)
                };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(30),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Issuer"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        private void SetTokenCookie(string token)
        {
            Response.Cookies.Append("AuthToken", token, new CookieOptions
            {
                HttpOnly = false,
                Secure = true,   // Chỉ gửi cookie qua HTTPS
                SameSite = SameSiteMode.Strict, // Ngăn chặn cookie từ các nguồn bên ngoài
                Expires = DateTimeOffset.UtcNow.AddDays(30) // Thời gian hết hạn của cookie
            });
        }
        [AllowAnonymous]
        [HttpPost]
        [Route("Logout")]
        public async Task<dynamic> Logout()
        {
            // Xóa cookie AuthToken
            Response.Cookies.Delete("AuthToken");

            return Ok(new { Message = "Logged out successfully." });
        }
    }
}

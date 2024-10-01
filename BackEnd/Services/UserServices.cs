using BackEnd.DataDto;
using BackEnd.Entities;
using System.Security.Cryptography;
using System.Text;

namespace BackEnd.Services
{
    public class UserServices
    {
        private readonly AppDbContext dbContext;

        public UserServices()
        {
            dbContext = new AppDbContext();
        }
        public User GetUserById(int id)
        {
            var query = dbContext.User.Find(id);
            if(query != null)
            {
                return query;
            }
            return null;
        }
        public async Task<IEnumerable<ReadUser>> GetAllUser()
        {
            var users = dbContext.User.AsQueryable();
            var userDtos = users
                .Select(u => new ReadUser
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Gender = u.Gender,
                    Address = u.Address,
                    Phone = u.Phone,
                    Image = u.Image
                });
            return userDtos;
        }
        public bool KiemTraEmail(string email)
        {
            // Kiểm tra tính duy nhất của email
            var qr = dbContext.User.FirstOrDefault(tk => tk.Email == email);

            if (qr != null)
            {
                return false; 
            }

            return true; 
        }
        public bool KiemTraEmail2(string email)
        {
            // Kiểm tra tính duy nhất của email dựa vào số lượng
            var qr = dbContext.User.Where(x=>x.Email == email).ToList();

            if (qr.Count < 2)
            {
                return true;
            }

            return false;
        }
        public void Create(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }

            dbContext.Add(user);
            dbContext.SaveChanges();
        }
        public void Update(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException("user");
            }

            dbContext.Update(user);
            dbContext.SaveChanges();
        }
        public async Task<User> Login(string email, string password)
        {
            var query = dbContext.User.SingleOrDefault(u => u.Email == email && u.Password == password);
            if (query != null)
            {
                return query;
            }
            return null;
        }
        public string GetSHA256Hash(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(input);
                byte[] hash = sha256.ComputeHash(bytes);

                StringBuilder stringBuilder = new StringBuilder();
                for (int i = 0; i < hash.Length; i++)
                {
                    stringBuilder.Append(hash[i].ToString("x2"));
                }
                return stringBuilder.ToString();
            }
        }
    }
}

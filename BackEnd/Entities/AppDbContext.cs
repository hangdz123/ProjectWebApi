using Microsoft.EntityFrameworkCore;

namespace BackEnd.Entities
{
    public class AppDbContext : DbContext
    {
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<Setting> Setting { get; set; }
        public virtual DbSet<Items> Items { get; set; }
        public virtual DbSet<ItemsType> ItemsType { get; set; }
        public virtual DbSet<Manufacturer> Manufacturer { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql("server=localhost;uid=root;pwd=123456;database=appnetcore;",
                 new MySqlServerVersion(new Version(8, 0, 37)));
        }
    }
}

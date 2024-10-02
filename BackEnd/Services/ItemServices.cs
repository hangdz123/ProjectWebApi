using BackEnd.DataDto;
using BackEnd.Entities;

namespace BackEnd.Services
{
    public class ItemServices
    {
        private readonly AppDbContext dbContext;

        public ItemServices()
        {
            dbContext = new AppDbContext();
        }
        public Items GetItemById(int id)
        {
            var query = dbContext.Items.Find(id);
            if (query != null)
            {
                return query;
            }
            return null;
        }
        public async Task<IEnumerable<ItemsDto>> GetAllItem()
        {
            var item = dbContext.Items.AsQueryable();
            var itemDtos = item
                .Select(i => new ItemsDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Quantity = i.Quantity,
                    Image = i.Image,                   
                    ItemsTypeId = i.ItemsTypeId,
                    ManufacturerId = i.ManufacturerId,
                    DateUpdate = i.DateUpdate,
                    PriceImport = i.PriceImport,
                    Price = i.Price,
                    PromotionalPrice = i.PromotionalPrice
                });
            return itemDtos;
        }
        public async Task<IEnumerable<ItemTypeDto>> GetItemType()
        {
            var item = dbContext.ItemsType.AsQueryable();
            var itemDtos = item
                .Select(i => new ItemTypeDto
                {
                    Id = i.Id,
                    Name = i.Name
                });
            return itemDtos;
        }
        public class ItemTypeDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
        public async Task<IEnumerable<ItemManuDto>> GetItemManu()
        {
            var item = dbContext.Manufacturer.AsQueryable();
            var itemDtos = item
                .Select(i => new ItemManuDto
                {
                    Id = i.Id,
                    Name = i.Name
                });
            return itemDtos;
        }
        public class ItemManuDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
        public async Task<ItemsDto> GetDetailItem(int id)
        {
            var item = dbContext.Items.Find(id);
            var itemDtos = new ItemsDto
            {
                Id = item.Id,
                Name = item.Name,
                ItemsTypeId = item.ItemsTypeId,
                ManufacturerId = item.ManufacturerId,
                Quantity = item.Quantity,
                DateUpdate = item.DateUpdate,
                PriceImport = item.PriceImport,
                Price = item.Price,
                PromotionalPrice = item.PromotionalPrice,
                Image = item.Image
            };
            return itemDtos;
        }
        public void Create(Items item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            dbContext.Add(item);
            dbContext.SaveChanges();
        }
        public void Update(Items item)
        {
            if (item == null)
            {
                throw new ArgumentNullException("item");
            }

            dbContext.Update(item);
            dbContext.SaveChanges();
        }
    }
}

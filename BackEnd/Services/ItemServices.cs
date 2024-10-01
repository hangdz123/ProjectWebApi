﻿using BackEnd.DataDto;
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
                    Image = i.Image
                });
            return itemDtos;
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
    }
}

using BackEnd.DataDto;
using BackEnd.Entities;
using BackEnd.IServices;
using BackEnd.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AppDbContext dbContext;
        private readonly ItemServices itemServices;

        public ItemsController(IConfiguration configuration)
        {
            dbContext = new AppDbContext();
            itemServices = new ItemServices();
            _configuration = configuration;

        }
        [HttpGet]
        [Route("GetItemById")]
        public IActionResult GetUserById(int Id)
        {
            var query = itemServices.GetItemById(Id);
            return Ok(query);
        }
        //[Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("GetAllItem")]
        public IActionResult GetAllItem()
        {
            var query = itemServices.GetAllItem();
            return Ok(query);
        }
        [HttpGet]
        [Route("GetAllItemType")]
        public IActionResult GetAllItemType()
        {
            var query = itemServices.GetItemType();
            return Ok(query);
        }
        [HttpGet]
        [Route("GetAllItemManu")]
        public IActionResult GetAllItemManu()
        {
            var query = itemServices.GetItemManu();
            return Ok(query);
        }
        [HttpGet]
        [Route("GetItemDetail")]
        public IActionResult GetItemDetail(int Id)
        {
            var query = itemServices.GetDetailItem(Id);
            return Ok(query);
        }
        [HttpPost]
        [Route("CreateItem")]
        public async Task<dynamic> Create([FromForm] ItemsDto dto, IFormFile? imageFile)
        {
            // Lấy đường dẫn wwwroot của Project B từ cấu hình
            var projectBWebRootPath = _configuration["Paths:WebRootPath"];
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), projectBWebRootPath, "upload");

            Items item = new Items
            {
                Name = dto.Name,
                ItemsTypeId = dto.ItemsTypeId,
                ManufacturerId = dto.ManufacturerId,
                Quantity = dto.Quantity,
                DateUpdate = DateTime.Now,
                PriceImport = dto.PriceImport,
                Price = dto.Price,
                PromotionalPrice = dto.PromotionalPrice
            };
            itemServices.Create(item);
            // Lưu file ảnh vào thư mục wwwroot của Project B
            if (imageFile != null && imageFile.Length > 0)
            {
                string imagePath = Path.Combine(fullPath, "Item_" + item.Id + Path.GetExtension(imageFile.FileName));
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
                item.Image = "Item_" + item.Id + Path.GetExtension(imageFile.FileName);
            }
            dbContext.Update(item);
            dbContext.SaveChanges();
            return item;
        }
        [HttpPost]
        [Route("UpdateItem")]
        public async Task<dynamic> Update([FromForm] ItemsDto dto, IFormFile? imageFile)
        {
            //Kiểm tra item có tồn tại không
            var item = itemServices.GetItemById(dto.Id);
            if (item == null)
            {
                return BadRequest("item không tồn tại");
            }

            var projectBWebRootPath = _configuration["Paths:WebRootPath"];
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), projectBWebRootPath, "upload");

            item.Id = dto.Id;
            item.Name = dto.Name;
            item.ItemsTypeId = dto.ItemsTypeId;
            item.ManufacturerId = dto.ManufacturerId;
            item.Quantity = dto.Quantity;
            item.DateUpdate = DateTime.Now;
            item.PriceImport = dto.PriceImport;
            item.Price = dto.Price;
            item.PromotionalPrice = dto.PromotionalPrice;

            if (imageFile != null && imageFile.Length > 0)
            {
                string imagePath = Path.Combine(fullPath, "Item_" + item.Id + Path.GetExtension(imageFile.FileName));
                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }
                item.Image = "Item_" + item.Id + Path.GetExtension(imageFile.FileName);
            }

            itemServices.Update(item);
            return item;
        }
        [HttpDelete]
        [Route("DeleteItem")]
        public async Task<dynamic> Delete(int id)
        {
            var searchItem = itemServices.GetItemById(id);
            if (searchItem != null)
            {
                dbContext.Remove(searchItem);
                dbContext.SaveChanges();
                return Ok();
            }
            return BadRequest("Không tồn tại");
        }
    }
}
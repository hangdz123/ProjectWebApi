using BackEnd.Entities;
using BackEnd.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackEnd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly AppDbContext dbContext;
        private readonly ItemServices itemServices; 

        public ItemsController()
        {
            dbContext = new AppDbContext();
            itemServices = new ItemServices();
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
    }
}

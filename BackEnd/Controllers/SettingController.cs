using BackEnd.DataDto;
using BackEnd.Entities;
using BackEnd.IServices;
using BackEnd.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace BackEnd.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SettingController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public SettingController()
        {
            dbContext = new AppDbContext();
        }
        //[Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("GetAllSetting")]
        public IActionResult GetAllUser()
        {
            var query = dbContext.Setting.AsQueryable();
            return Ok(query);
        }
        //[Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("UpdateSetting")]
        public async Task<dynamic> Update(SettingDto model)
        {
            var qr = dbContext.Setting.FirstOrDefault(x=>x.Id == model.Id);
            if (qr == null)
            {
                return BadRequest();
            }
            qr.Id = qr.Id;
            qr.Key = qr.Key;
            qr.Value = model.Value;

            dbContext.Update(qr);
            dbContext.SaveChanges();
            return true;
        }
    }
}

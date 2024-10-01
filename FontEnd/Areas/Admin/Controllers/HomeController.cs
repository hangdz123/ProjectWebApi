using Microsoft.AspNetCore.Mvc;

namespace FontEnd.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class HomeController : Controller
    {
        public IActionResult HomePage()
        {
            return View();
        }
        public IActionResult UserPage()
        {
            return View();
        }
        public IActionResult BoxPage()
        {
            return View();
        }
        public IActionResult SettingPage()
        {
            return View();
        }
    }
}

using Microsoft.AspNetCore.Mvc;

namespace FontEnd.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}


using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Library.Service;
using Library.DTO;
using Library.Filters;

namespace Library.Controllers
{
    [UserAuthorizeAttribute]
    public class HomeController : Controller
    {
        private BooksPanelService booksPanelService = new BooksPanelService();
        // GET: Home
        public ActionResult Index(BooksListDTO model)
        {
            var validUserCampusId = Library.Helpers.Utility.GetValidUserCampus().CampusID;

            var books = booksPanelService.GetAllBooks().Where(x=>x.CampusID==validUserCampusId).OrderByDescending(x=>x.BookID).Take(50).ToList();
            return View(books);
        }
        public JsonResult GetFilteredBooks(BooksListDTO model)
        {
            var books = booksPanelService.GetFilteredBooks(model).ToList();

            return Json(books);
        }

    }
}
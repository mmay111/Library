using Library.Admin.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Library.Service;
using Library.DTO;


namespace Library.Admin.Controllers
{
    [LibrarianAuthorizeAttribute]
    public class HomeController : Controller
    {
        private BooksPanelService booksPanelService = new BooksPanelService();
        // GET: Home
        public ActionResult Index()
        {
            //stok altına düşünen kitaplar için
            //var validUserCampusId = Helper.Utility.GetValidUserCampus().CampusID;
            //var allBook = booksPanelService.GetAllBooksForReportByCampusID(validUserCampusId);
            //var roman=allBook.Where()
            
            return View();
        }
    }
}
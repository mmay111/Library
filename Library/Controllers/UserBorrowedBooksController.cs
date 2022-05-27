using Library.DTO;
using Library.Helpers;
using Library.Service;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Library.Filters;

namespace Library.Controllers
{
    [UserAuthorize]
    public class UserBorrowedBooksController : Controller
    {
        private UserBorrowedBooksService userBorrowedBooksService = new UserBorrowedBooksService();
        // GET: UserBorrowedBooks
        public ActionResult Index(jQueryDataTableParam parameter)
        {
            var validUserID = Helpers.Utility.GetValidUserID();



            var books = userBorrowedBooksService.GetUserAllBorrowedBooks(validUserID);

            var data = from c in books
                       select new BorrowedBookListForDiplayDTO
                       {
                           BookName = c.BookName,
                           AuthorName = c.AuthorName,
                           Barcode = c.Barcode,
                           BookBorrowFee = c.BookBorrowFee,

                           BorrrowDate = c.BorrrowDate.ToString("dd MM yyyy"),
                           BorrowExpiresDate = c.BorrowExpiresDate.ToString("dd MM yyyy"),
                           CampusName = c.CampusName,
                           IsReturnedBool = c.IsReturned,
                           IsReturned = Utility.GetIsReturned(c.IsReturned),
                       };




            return View(data);
        }
        public ActionResult Report()
        {
            var validUser = Helpers.Utility.GetValidUserInfo();
            var borrowedBooks = userBorrowedBooksService.GetUserAllBorrowedBooks(validUser.UserID).ToList();
            return PDF(borrowedBooks, "Report");
        }
        public ViewAsPdf PDF(List<BorrowedBooksListDTO> data, string viewName)
        {
            var validUserId = Helpers.Utility.GetValidUserID();
            var unix = DateTimeOffset.Now.ToUnixTimeMilliseconds();
            return new ViewAsPdf(viewName, data)
            {
                FileName = string.Format("{0}-{1}.pdf", validUserId, unix),
                ContentDisposition = Rotativa.Options.ContentDisposition.Inline,
                PageSize = Rotativa.Options.Size.A6,
                //PageWidth = 595,
                //PageHeight = 1000,
                PageOrientation = Rotativa.Options.Orientation.Portrait,
                PageMargins = { Left = 0, Right = 0, Top = 0, Bottom = 0 },
                CustomSwitches = "--no-stop-slow-scripts --javascript-delay 1000",
            };
        }


    }
}
using Library.DTO;
using Library.Helpers;
using Library.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Library.Controllers
{
    public class UserBorrowedBooksController : Controller
    {
        private UserBorrowedBooksService userBorrowedBooksService = new UserBorrowedBooksService();
        // GET: UserBorrowedBooks
        public ActionResult Index(jQueryDataTableParam parameter)
        {
            var validUserID = Helpers.Utility.GetValidUserID();



            var books = userBorrowedBooksService.GetUserAllBorrowedBooks(validUserID);
            var objDataTable = new JsonDataTable();
            
            var d = from c in books
                                  select new BorrowedBookListForDiplayDTO
                                  {
                                      BookName=c.BookName,
                                      AuthorName=c.AuthorName,
                                      Barcode=c.Barcode,
                                      BookBorrowFee=c.BookBorrowFee,

                                      BorrrowDate =c.BorrrowDate.ToString("dd MM yyyy"),
                                      BorrowExpiresDate=c.BorrowExpiresDate.ToString("dd MM yyyy"),
                                      CampusName=c.CampusName,
                                      IsReturnedBool=c.IsReturned,
                                      IsReturned=Utility.GetIsReturned(c.IsReturned),
                                  };



            
            return View(d);
        }
        
        
    }
}
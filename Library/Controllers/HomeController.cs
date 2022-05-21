
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Library.Service;
using Library.DTO;
using Library.Filters;
using Library.Data;

namespace Library.Controllers
{
    [UserAuthorizeAttribute]
    public class HomeController : Controller
    {
        private BooksPanelService booksPanelService = new BooksPanelService();
        private BookRequestsPanelService bookRequestsPanelService = new BookRequestsPanelService();
        private BorrowedBooksPanelService borrowedBooksPanelService = new BorrowedBooksPanelService();
        private DefinitionService definitionService = new DefinitionService();
        // GET: Home
        public ActionResult Index(BooksListDTO model)
        {

            var validUserID = Helpers.Utility.GetValidUserID();

            var availableBookRequest = bookRequestsPanelService.GetBookRequestByUserID(validUserID);
            if (availableBookRequest != null)
            {
                ViewBag.AvailableBookRequest = availableBookRequest;
            }

            var validUserCampusId = Library.Helpers.Utility.GetValidUserCampus().CampusID;
            var books = booksPanelService.GetAllBooks().Where(x => x.CampusID == validUserCampusId).OrderByDescending(x => x.BookID).Take(50).ToList();
            return View(books);
        }
        public JsonResult GetFilteredBooks(BooksListDTO model)
        {
            var books = booksPanelService.GetFilteredBooks(model).ToList();

            return Json(books);
        }

        public JsonResult BookRequestUpdate(int bookrequestId)
        {
            BookRequestDTO currentrequest = bookRequestsPanelService.GetBookRequestByID(bookrequestId);


            currentrequest.IsActive = false;

            var result = bookRequestsPanelService.Update(currentrequest);
            if (result)
            {
                return Json("işlem başarılı bir şekilde gerçekleşti.", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("işlem sırasında bir hata oluştu!", JsonRequestBehavior.AllowGet);
            }



        }
        public JsonResult BorrowBook(userBorrowBookListDTO model)
        {

            var validUserID = Helpers.Utility.GetValidUserID();
            var validUserInfo= Helpers.Utility.GetValidUserInfo();
            var borrowedBooksMaxnumber = booksPanelService.BorrowedBooksMaxNumber().maxNumber;

            var userCurrentBorrowedBooksCount = borrowedBooksPanelService.GetBorrowedBooksCountByUserID(validUserID);
            var multiplier = 1;
            if (validUserInfo.UserTypeID == 3)//guest
            {
                borrowedBooksMaxnumber = borrowedBooksMaxnumber / 2;//misafir max alınan kaynak sayısının yarısı kadar alabilir
                multiplier = 2;//misafir 2 kat fazla ödeme yapar
            }
            
            if (borrowedBooksMaxnumber > userCurrentBorrowedBooksCount)
            {

                BooksListDTO currentBook = booksPanelService.GetByID(model.BookID);
                //var currentBookResorceTypeCount= booksPanelService.
                var bookBorrowFeeRow = borrowedBooksPanelService.GetBookBorrowFeeById(model.BookBorrowFeeID);


                
                BorrowedBooksDTO data = new BorrowedBooksDTO
                {
                    BookID = model.BookID,
                    UserID = validUserID,
                    BorrrowDate = DateTime.Now,
                    BookBorrowFee = int.Parse(bookBorrowFeeRow.BorrowFee)*multiplier,
                    BorrowExpiresDate = DateTime.Now.AddDays(bookBorrowFeeRow.NumberOfDateBorrowed),
                    IsActive = true,
                    IsReturned = false,
                };
                var bookBorrowResult = borrowedBooksPanelService.Insert(data);
                if (bookBorrowResult != null)
                {
                    var bookDetails = booksPanelService.GetBookDetailByID(currentBook.BookDetailsID);

                    bookDetails.IsAvailable = false;
                    var result = booksPanelService.UpdateBookDetails(bookDetails);
                    if (result)
                    {
                        return Json("Kitap ödünç alındı.", JsonRequestBehavior.AllowGet);
                    }
                    else
                    {

                        return Json("işlem sırasında bir hata oluştu!", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {

                    return Json("işlem sırasında bir hata oluştu!", JsonRequestBehavior.AllowGet);
                }


            }
            else
            {
                return Json("Ödünç alabileceğiniz maximum kitap sayısını geçtiniz!", JsonRequestBehavior.AllowGet);
            }




        }

        public PartialViewResult _BorrrowBookPage(int bookId)
        {
            BooksListDTO currentBook = booksPanelService.GetByID(bookId);
            var BookBorrowFeeID = definitionService.GetAllActiveBookBorrowFees();

            userBorrowBookListDTO userBorrowBook = new userBorrowBookListDTO
            {
                BookID = currentBook.BookID,
                BookName = currentBook.BookName,
            };

            ViewBag.BookBorrowFeeID = new SelectList(BookBorrowFeeID, "BookBorrowFeeID", "NumberOfDateBorrowed");
            return PartialView("_BorrrowBookPage", userBorrowBook);



        }

    }
}
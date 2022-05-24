﻿
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
        private UserBorrowedBooksService userBorrowedBooksService = new UserBorrowedBooksService();
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
            model.CampusID = validUserCampusId;
            var books = booksPanelService.GetFilteredBooks(model).OrderByDescending(x => x.BookID).Take(50).ToList();
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

            BooksListDTO currentBook = booksPanelService.GetByID(model.BookID);
            int booksCountByResourceTypeID = booksPanelService.GetAllBooksCountByResourceTypeIDandCampusID(currentBook.ResourceTypeID, validUserInfo.CampusID);

            int availableBooksCountByResourceTypeID = booksPanelService.GetAlllAvailableBooksCountByResourceTypeIDandCampusID(currentBook.ResourceTypeID, validUserInfo.CampusID);

            float ratio = (float)availableBooksCountByResourceTypeID / (float)booksCountByResourceTypeID *100;
            if (ratio < 10)//Kategorilerden herhangi birinde mevcut kaynak sayısının %10’unun altına indiğinde, kaynak miktarı % 10’un üstüne çıkana kadar ilgili kategoriden hiçbir kullanıcıya kitap ödünç verilmeyecektir
            {
                return Json("Kategori bazında kitap miktarı yüzde 10'un altına düştüğü için ödünç verme işlemi gerçekleştirilemiyor.", JsonRequestBehavior.AllowGet);
            }
            else
            {
                if (validUserInfo.UserTypeID == 1 && validUserInfo.IsActive == false)//kayıt dondurmuş öğrenciler için
                {
                    if (ratio < 50)
                    {
                        return Json("Kategori bazında kitap miktarı yüzde 50'nin altında olduğu için kayıt dondurmuş öğrencilere ödünç verme işlemi gerçekleştirilemiyor.", JsonRequestBehavior.AllowGet);
                    }
                    borrowedBooksMaxnumber = borrowedBooksMaxnumber / 2;//kayıt dodurmuş öğrenci max alınan kaynak sayısının yarısı kadar alabilir
                    multiplier = 2;//kayıt dodurmuş öğrenci 2 kat fazla ödeme yapar
                    
                }
                if (validUserInfo.UserTypeID == 3)//guest
                {
                    if (ratio < 50)
                    {
                        return Json("Kategori bazında kitap miktarı yüzde 50'nin altında olduğu için kayıt dondormuş öğrencilere ödünç verme işlemi gerçekleştirilemiyor.", JsonRequestBehavior.AllowGet);
                    }
                    borrowedBooksMaxnumber = borrowedBooksMaxnumber / 2;//misafir max alınan kaynak sayısının yarısı kadar alabilir
                    multiplier = 2;//misafir 2 kat fazla ödeme yapar
                }

                if (borrowedBooksMaxnumber > userCurrentBorrowedBooksCount)
                {
                    //var currentBookResorceTypeCount= booksPanelService.
                    var bookBorrowFeeRow = borrowedBooksPanelService.GetBookBorrowFeeById(model.BookBorrowFeeID);

                    BorrowedBooksDTO data = new BorrowedBooksDTO
                    {
                        BookID = model.BookID,
                        UserID = validUserID,
                        BorrrowDate = DateTime.Now,
                        BookBorrowFee = int.Parse(bookBorrowFeeRow.BorrowFee) * multiplier,
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
        public PartialViewResult _ReturnBorrowExpiresDate(BookRequestDTO model)
        {
            BooksListDTO currentBook = booksPanelService.GetByID(model.BookID);

            var currentBorrowedBook = userBorrowedBooksService.GetByID(currentBook.BookID);


            ViewBag.BookBorrowExpiresDate = currentBorrowedBook.BorrowExpiresDate.ToString("dd MM yyyy");
            return PartialView("_ReturnBorrowExpiresDate", currentBorrowedBook);

        }
        public JsonResult RequestTheBook(BookRequestDTO model)
        {
            //BooksListDTO currentBook = booksPanelService.GetByID(bookId);
            var validUserID = Helpers.Utility.GetValidUserID();
            var borrowedBooksMaxnumber = booksPanelService.BorrowedBooksMaxNumber().maxNumber;
            var currentBorrowedBooksCount = userBorrowedBooksService.GetUserAllBorrowedBooks(validUserID).Count();

            if (currentBorrowedBooksCount >= borrowedBooksMaxnumber)//userın ödünç aldığı kitap sayısı kütüphanenin max ödünç alma miktarından fazla ise 
            {
                return Json("Ödünç alabileceğiniz veya talep oluşturabileceğiniz maximum kitap sayısına ulaştığınız için kaynak talebi gerçekleştirilemedi!", JsonRequestBehavior.AllowGet);
            }
            else
            {
                model.UserID = validUserID;
                model.IsActive = true;
                model.BookIsAvailable = false;

                var result = bookRequestsPanelService.Insert(model);
                if (result != null)
                {
                    return Json("Kitap talebi oluşturuldu", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json("Kitap talebi sırasında bir hata oluştu.", JsonRequestBehavior.AllowGet);
                }
            }
        }

    }
}
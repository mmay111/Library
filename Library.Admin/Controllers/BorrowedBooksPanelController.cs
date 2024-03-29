﻿using Library.Admin.Filters;
using Library.Admin.Models;
using Library.DTO;
using Library.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Library.Admin.Controllers
{
    [LibrarianAuthorizeAttribute]
    public class BorrowedBooksPanelController : Controller
    {
        private BorrowedBooksPanelService borrowedBooksPanelService = new BorrowedBooksPanelService();
        private BooksPanelService booksPanelService = new BooksPanelService();
        // GET: BorrowedBooksPanel
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetBorrowedBooks(jQueryDataTableParam parameters)
        {
            var rData = GetBorroedBooksForWebView(parameters);

            return Json(new
            {
                sEcho = rData.sEcho,
                iTotalRecords = rData.iTotalRecords,
                iTotalDisplayRecords = rData.iTotalDisplayRecords,
                aaData = rData.aaData
            },
                JsonRequestBehavior.AllowGet);
        }
        private JsonDataTable GetBorroedBooksForWebView(jQueryDataTableParam parameters)
        {
            var validUser = Helper.Utility.GetValidUserInfo();
            var sortColumnIndex = Convert.ToInt32((HttpContext.Request["iSortCol_1"]));
            var sortDirection = HttpContext.Request["sSortDir_1"];//asc or desc

            Func<BorrowedBooksListDTO, object> orderingFunction = (c => sortColumnIndex == 0 ? c.UserID :
                                    sortColumnIndex == 1 ? c.Name :
                                    sortColumnIndex == 2 ? c.AuthorName :
                                    sortColumnIndex == 3 ? c.Barcode :
                                    sortColumnIndex == 4 ? c.BookBorrowFee :
                                    sortColumnIndex == 5 ? c.CampusName :
                                    sortColumnIndex == 6 ? c.IsActive : new object());

            var data = borrowedBooksPanelService.GetAllBorrowedBooksbyCampusID(validUser.CampusID);
            var tempData = data?.OrderByDescending(x => x.UserID).ToList();

            var isName = HttpContext.Request["sSearch_0"];
            var isSurname = HttpContext.Request["sSearch_1"];
            var isEmailAddress = HttpContext.Request["sSearch_2"];
            var isUserTypeName = HttpContext.Request["sSearch_3"];
            var isCampusName = HttpContext.Request["sSearch_4"];

            if (!string.IsNullOrEmpty(isName))
            {
                tempData = tempData.Where(x => x.Name.ToString().ToLower().Contains(isName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isSurname))
            {
                tempData = tempData.Where(x => x.AuthorName.ToString().ToLower().Contains(isSurname.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isEmailAddress))
            {
                tempData = tempData.Where(x => x.Barcode.ToString().ToLower().Contains(isEmailAddress.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isUserTypeName))
            {
                tempData = tempData.Where(x => x.CampusName.ToString().ToLower().Contains(isUserTypeName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isCampusName))
            {
                tempData = tempData.Where(x => x.CampusName.ToString().ToLower().Contains(isCampusName.ToLower())).ToList();
            }


            tempData = sortDirection == "asc" ? tempData.OrderBy(orderingFunction).ToList() : tempData.OrderByDescending(orderingFunction).ToList();

            var displayedRecords = tempData.Skip(parameters.iDisplayStart).Take(parameters.iDisplayLength);

            var objDataTable = new JsonDataTable();
            var borrowedBooks = displayedRecords as BorrowedBooksListDTO[] ?? displayedRecords.ToArray();
            objDataTable.aaData = from c in borrowedBooks
                                  select new[]
                                    {

                                      c.Name,
                                      c.AuthorName,
                                      c.BookName,
                                      c.Barcode,
                                      c.BookBorrowFee.ToString(),
                                      c.CampusName,
                                      c.BorrrowDate.ToString("dd MM yyyy"),
                                      c.BorrowExpiresDate.ToString("dd MM yyyy"),
                                      Helper.Utility.GetIsReturned(c.IsReturned),

                                      string.Format("<button type='button' onclick='btnEdit({0})' class='btn btn-fit-height blue' > Update Return Status</button>", c.BorrowedBookID),
                                    };

            objDataTable.sEcho = parameters.sEcho;
            objDataTable.iTotalRecords = tempData.Count();
            objDataTable.iTotalDisplayRecords = tempData.Count();
            return objDataTable;
        }
        public JsonResult ReturnBorrowedBook(int borrowedBookID)
        {

            var borrowedBook = borrowedBooksPanelService.GetByID(borrowedBookID);
            var bookDetails = booksPanelService.GetByID(borrowedBook.BookID);
            if (borrowedBook.IsReturned)
            {
                borrowedBook.IsReturned = false;
                bookDetails.IsAvailable = false;
                
            }
            else
            {
                borrowedBook.IsReturned = true;
                bookDetails.IsAvailable = true;
            }

            var result = borrowedBooksPanelService.Update(borrowedBook);
            if (result)
            {
                var bookAvailableResult = booksPanelService.Update(bookDetails);
                return Json("Book return status updated.");
            }
            else
            {
                return Json("An error occurred during the book return.");
            }



        }
    }
}
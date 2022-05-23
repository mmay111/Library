using Library.Admin.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Library.DTO;
using Library.Service;
using Library.Admin.Models;
using System.Net;

namespace Library.Admin.Controllers
{
    [LibrarianAuthorizeAttribute]
    public class BookRequestsPanelController : Controller
    {
        private BookRequestsPanelService bookRequestsService = new BookRequestsPanelService();
        // GET: BookRequests
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetBookRequests(jQueryDataTableParam parameters)
        {
            var rData = GetBookRequestsForWebView(parameters);

            return Json(new
            {
                sEcho = rData.sEcho,
                iTotalRecords = rData.iTotalRecords,
                iTotalDisplayRecords = rData.iTotalDisplayRecords,
                aaData = rData.aaData
            },
                JsonRequestBehavior.AllowGet);


        }
        private JsonDataTable GetBookRequestsForWebView(jQueryDataTableParam parameters)
        {
            var sortColumnIndex = Convert.ToInt32((HttpContext.Request["iSortCol_1"]));
            var sortDirection = HttpContext.Request["sSortDir_1"];//asc or desc

            Func<BookRequestListDTO, object> orderingFunction = (c => sortColumnIndex == 0 ? c.BookRequestID :
                                    sortColumnIndex == 1 ? c.Name :
                                    sortColumnIndex == 2 ? c.BookName :
                                    sortColumnIndex == 3 ? c.IsAvailable :
                                    sortColumnIndex == 4 ? c.IsActive : new object());

            var data = bookRequestsService.GetAllBookRequests();
            var tempData = data?.OrderByDescending(x => x.BookRequestID).ToList();

            var isName = HttpContext.Request["sSearch_0"];
            var isSurname = HttpContext.Request["sSearch_1"];
            

            if (!string.IsNullOrEmpty(isName))
            {
                tempData = tempData.Where(x => x.Name.ToString().ToLower().Contains(isName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isSurname))
            {
                tempData = tempData.Where(x => x.BookName.ToString().ToLower().Contains(isSurname.ToLower())).ToList();
            }
            


            tempData = sortDirection == "asc" ? tempData.OrderBy(orderingFunction).ToList() : tempData.OrderByDescending(orderingFunction).ToList();

            var displayedRecords = tempData.Skip(parameters.iDisplayStart).Take(parameters.iDisplayLength);

            var objDataTable = new JsonDataTable();
            var bookrequests = displayedRecords as BookRequestListDTO[] ?? displayedRecords.ToArray();
            objDataTable.aaData = from c in bookrequests
                                  select new[]
                                    {

                                      c.Name,
                                      c.BookName,
                                      Helper.Utility.GetIsAvailable(c.IsAvailable),
                                      Helper.Utility.GetIsActive(c.IsActive),
                                      string.Format("<a href='/BookRequestsPanel/Edit/{0}'class='bold'> Düzenle</a>",c.BookRequestID),
                                    };

            objDataTable.sEcho = parameters.sEcho;
            objDataTable.iTotalRecords = tempData.Count();
            objDataTable.iTotalDisplayRecords = tempData.Count();
            return objDataTable;
        }
        //public ActionResult Edit(int bookRequestID)
        //{
        //    if (bookRequestID < 1)
        //    {
        //        return  HttpStatusCodeResult(HttpStatusCode.BadRequest);
        //    }
        //    BooksListDTO book = booksPanelService.GetByID(id);
        //    if (book == null)
        //        return HttpNotFound();

        //    ViewBag.ResourceTypes = defService.GetAllActiveResorceTypes()?.OrderBy(x => x.ResourceTypeID).ToList();
        //    //ViewBag.Campuses = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusID).ToList();
        //    return View(book);
        //}
    }
}
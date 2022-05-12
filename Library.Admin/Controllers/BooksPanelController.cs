using Library.Admin.Filters;
using Library.Admin.Models;
using Library.DTO;
using Library.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace Library.Admin.Controllers
{
    [LibrarianAuthorizeAttribute]
    public class BooksPanelController : Controller
    {
        private BooksPanelService booksPanelService = new BooksPanelService();
        private DefinitionService defService = new DefinitionService();
        private AuthorsPanelService authorsPanelService = new AuthorsPanelService();
        // GET: Books
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetBooks(jQueryDataTableParam parameters)
        {
            var rData = GetBooksForWebView(parameters);

            return Json(new
            {
                sEcho = rData.sEcho,
                iTotalRecords = rData.iTotalRecords,
                iTotalDisplayRecords = rData.iTotalDisplayRecords,
                aaData = rData.aaData
            },
                JsonRequestBehavior.AllowGet);


        }
        private JsonDataTable GetBooksForWebView(jQueryDataTableParam parameters)
        {
            var sortColumnIndex = Convert.ToInt32((HttpContext.Request["iSortCol_1"]));
            var sortDirection = HttpContext.Request["sSortDir_1"];//asc or desc

            Func<BooksListDTO, object> orderingFunction = (c => sortColumnIndex == 0 ? c.BookID :
                                    sortColumnIndex == 1 ? c.BookName :
                                    sortColumnIndex == 2 ? c.AuthorName :
                                    sortColumnIndex == 3 ? c.Barcode :
                                    sortColumnIndex == 4 ? c.ResourceTypeID :
                                    sortColumnIndex == 5 ? c.CampusID :
                                    sortColumnIndex == 6 ? c.IsAvailable :
                                    sortColumnIndex == 7 ? c.IsPrinted :
                                    sortColumnIndex == 8 ? c.IsActive : new object());

            var data = booksPanelService.GetAllBooks();
            var tempData = data?.OrderByDescending(x => x.BookID).ToList();

            var isName = HttpContext.Request["sSearch_0"];
            var isAuthor = HttpContext.Request["sSearch_1"];
            var isBarcode = HttpContext.Request["sSearch_2"];
            var isResourceTypeName = HttpContext.Request["sSearch_3"];
            var isCampusName = HttpContext.Request["sSearch_4"];

            if (!string.IsNullOrEmpty(isName))
            {
                tempData = tempData.Where(x => x.BookName.ToString().ToLower().Contains(isName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isAuthor))
            {
                tempData = tempData.Where(x => x.AuthorName.ToString().ToLower().Contains(isAuthor.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isBarcode))
            {
                tempData = tempData.Where(x => x.Barcode.ToString().ToLower().Contains(isBarcode.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isResourceTypeName))
            {
                tempData = tempData.Where(x => x.ResourceTypeName.ToString().ToLower().Contains(isResourceTypeName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isCampusName))
            {
                tempData = tempData.Where(x => x.CampusName.ToString().ToLower().Contains(isCampusName.ToLower())).ToList();
            }


            tempData = sortDirection == "asc" ? tempData.OrderBy(orderingFunction).ToList() : tempData.OrderByDescending(orderingFunction).ToList();

            var displayedRecords = tempData.Skip(parameters.iDisplayStart).Take(parameters.iDisplayLength);

            var objDataTable = new JsonDataTable();
            var books = displayedRecords as BooksListDTO[] ?? displayedRecords.ToArray();
            objDataTable.aaData = from c in books
                                  select new[]
                                    {

                                      c.BookName,
                                      c.AuthorName,
                                      c.Barcode,
                                      c.ResourceTypeName,
                                      c.CampusName,
                                      Helper.Utility.GetIsAvailable(c.IsAvailable),
                                      Helper.Utility.GetIsPrinted(c.IsPrinted),
                                      Helper.Utility.GetIsActive(c.IsActive),
                                      string.Format("<a href='/BooksPanel/Edit/{0}'class='bold'> Düzenle</a>",c.BookID),
                                    };

            objDataTable.sEcho = parameters.sEcho;
            objDataTable.iTotalRecords = tempData.Count();
            objDataTable.iTotalDisplayRecords = tempData.Count();
            return objDataTable;
        }
        public ActionResult Create()
        {
            var resourceTypes = defService.GetAllActiveResorceTypes()?.OrderBy(x => x.ResourceTypeID).ToList();
            ViewBag.ResourceTypeID = new SelectList(resourceTypes, "ResourceTypeID", "ResourceTypeName");
            var campuses = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusName).ToList();
            ViewBag.CampusID = new SelectList(campuses, "CampusID", "CampusName");

            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(BooksListDTO model)
        {
            var bookExist = booksPanelService.GetByID(model.BookID);
            if (bookExist != null)
            {
                var resourceTypes = defService.GetAllActiveResorceTypes()?.OrderBy(x => x.ResourceTypeID).ToList();
                ViewBag.ResourceTypeID = new SelectList(resourceTypes, "ResourceTypeID", "ResourceTypeName");
                var campuses = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusName).ToList();
                ViewBag.CampusID = new SelectList(campuses, "CampusID", "CampusName");

                return View(model);
            }
            else
            {
                model.IsActive = true;
                model.IsAvailable = true;
                AuthorDTO author = authorsPanelService.GetByName(model.AuthorName);
                if (author != null)
                    model.AuthorID = author.AuthorID;
                else
                    model.AuthorID = 0;
                var result = booksPanelService.Insert(model);

                if (result != false)
                {
                    return RedirectToAction("Index");
                }
                else
                {
                    var resourceTypes = defService.GetAllActiveResorceTypes()?.OrderBy(x => x.ResourceTypeID).ToList();
                    ViewBag.ResourceTypeID = new SelectList(resourceTypes, "ResourceTypeID", "ResourceTypeName");
                    var campuses = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusName).ToList();
                    ViewBag.CampusID = new SelectList(campuses, "CampusID", "CampusName");

                    ViewBag.Error = "Error";
                    return View(model);
                }
            }
        }
        public ActionResult Edit(int id)
        {
            if (id < 1)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
             BooksListDTO book = booksPanelService.GetByID(id);
            if (book == null)
                return HttpNotFound();

            ViewBag.ResourceTypes = defService.GetAllActiveResorceTypes()?.OrderBy(x => x.ResourceTypeID).ToList();
            ViewBag.Campuses = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusID).ToList();
            return View(book);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(BooksListDTO model)
        {
            BooksListDTO currentBook = booksPanelService.GetByID(model.BookID);

            AuthorDTO author = authorsPanelService.GetByName(model.AuthorName);
            if (author.AuthorID != currentBook.AuthorID)
                model.AuthorID = 0;

            bool result = booksPanelService.Update(model);
            if (result)
                return RedirectToAction("Index");

            ViewBag.ResourceTypes = defService.GetAllActiveUserTypes()?.OrderBy(x => x.UserTypeID).ToList();
            ViewBag.Campuses = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusID).ToList();
            ViewBag.Error = "Error";
            return View(model);
        }
    }
}
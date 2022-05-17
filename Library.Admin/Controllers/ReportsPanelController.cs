using Library.Admin.Filters;
using Library.Admin.Models;
using Library.DTO;
using Library.Service;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace Library.Admin.Controllers
{
    [LibrarianAuthorizeAttribute]
    public class ReportsPanelController : Controller
    {
        private ReportPanelService reportPanelService = new ReportPanelService();
        private BooksPanelService booksPanelService = new BooksPanelService();
        private DefinitionService definitionService = new DefinitionService();
        private BorrowedBooksPanelService borrowedBooksService = new BorrowedBooksPanelService();
        

        // GET: ReportsPanel
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetReports(jQueryDataTableParam paramaters, int type)
        {
            var rData = GetReportsForWebWiew(paramaters, type);

            return Json(new
            {
                sEcho = rData.sEcho,
                iTotalRecords = rData.iTotalRecords,
                iTotalDisplayRecords = rData.iTotalDisplayRecords,
                aaData = rData.aaData
            },
                 JsonRequestBehavior.AllowGet);
        }
        private JsonDataTable GetReportsForWebWiew(jQueryDataTableParam paramaters, int type)
        {
            var sortColumnIndex = Convert.ToInt32((HttpContext.Request["iSortCol_1"]));
            var sortDirection = HttpContext.Request["sSortDir_1"]; // asc or desc

            Func<CampusDTO, object> orderingFunction = (c => sortColumnIndex == 0 ? c.CampusID :
                                     sortColumnIndex == 1 ? c.CampusName : new object());

            List<CampusDTO> data = definitionService.GetAllActiveCampuses();

            //data.Add(new CampusDTO() { CampusID = 0, CampusName = "Tüm Kampüsler" });

            var tempData = data?.OrderByDescending(x => x.CampusID).ToList();

            var isCampusName = HttpContext.Request["sSearch_0"];

            if (!string.IsNullOrEmpty(isCampusName))
            {
                tempData = tempData.Where(x => x.CampusName.ToLower().Contains(isCampusName.ToLower())).ToList();
            }

            tempData = sortDirection == "asc" ? tempData.OrderBy(orderingFunction).ToList() : tempData.OrderByDescending(orderingFunction).ToList();

            var displayedRecords = tempData.Skip(paramaters.iDisplayStart).Take(paramaters.iDisplayLength);

            var objDataTable = new JsonDataTable();
            var campuses = displayedRecords as CampusDTO[] ?? displayedRecords.ToArray();



            objDataTable.aaData = from c in campuses
                                  select new[]
                                    {
                                      c.CampusID.ToString(),
                                      c.CampusName,
                                       string.Format("<a class='btn btn-xs blue-hoki' target='_blank' href='"+Url.Action("Report","ReportsPanel",new { campusID = c.CampusID,type = type })+"''>Raporu görüntüle</a>",c.CampusID),


                                    };

            objDataTable.sEcho = paramaters.sEcho;
            objDataTable.iTotalRecords = tempData.Count();
            objDataTable.iTotalDisplayRecords = tempData.Count();
            return objDataTable;

        }
        public ActionResult Report(int campusID, int type)
        {

            if (Helper.Utility.GetValidUserInfo() != null)
            {

                List<CampusDTO> cm = definitionService.GetAllActiveCampuses().Where(x => x.CampusID == campusID).ToList();
                
                var campusName = Helper.Utility.GetValidUserCampus().CampusName;
                var booksCount = 0;
                if (campusID == 0)
                {
                    booksCount = booksPanelService.GetAllBooks().Where(x=>x.IsActive==true).Count();
                }
                else
                {
                    booksCount = booksPanelService.GetBooksCountByCampusID(campusID);
                }
                var borrowedBooksCount = 0;
                string dateStart=null;
                string dateFinish=null;
                if (type == 0)
                {
                    borrowedBooksCount = borrowedBooksService.GetTodaysBorrowedBooksByCampusID(campusID).Count();
                    dateStart = DateTime.Now.ToString("dd.MM.yyyy 00:00:00");
                    
                    dateFinish = DateTime.Now.ToString();

                }
                else if (type == 1)
                {
                    borrowedBooksCount = borrowedBooksService.GetLastWeekBorrowedBooksByCampusID(campusID).Count();
                    dateStart = DateTime.Now.AddDays(-7).ToString();
                    dateFinish = DateTime.Now.ToString();
                }
                else if (type == 2)
                {
                    borrowedBooksCount = borrowedBooksService.GetLastMonthBorrowedBooksByCampusID(campusID).Count();
                    dateStart = DateTime.Now.AddDays(-30).ToString();
                    dateFinish = DateTime.Now.ToString();
                }
                var availableBooksCount = booksCount - borrowedBooksCount;
                 var data = (new CampusReportDTO
                {
                    CampusName=campusName,
                    BooksCount = booksCount,
                    AvailableBooksCount=availableBooksCount,
                    BorrowedBooksCount = borrowedBooksCount,
                    DateStart=dateStart,
                    DateFinish=dateFinish,
                });

               
                return PDF(data, "Report");

            }
            else
            {
                return new HttpStatusCodeResult(HttpStatusCode.Unauthorized);
            }

        }
        public ViewAsPdf PDF(CampusReportDTO data, string viewName)
        {
            var unix = DateTimeOffset.Now.ToUnixTimeMilliseconds();
            return new ViewAsPdf(viewName, data)
            {
                FileName = string.Format("{0}-{1}.pdf", data.CampusID, unix),
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
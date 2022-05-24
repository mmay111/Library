using Library.Admin.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Library.Service;
using Library.DTO;
using Rotativa;

namespace Library.Admin.Controllers
{
    [LibrarianAuthorizeAttribute]
    public class HomeController : Controller
    {
        private BooksPanelService booksPanelService = new BooksPanelService();
        private DefinitionService defService = new DefinitionService();
        // GET: Home
        public ActionResult Index()
        {
            //stok altına düşünen kitaplar için
            var validUserCampusId = Helper.Utility.GetValidUserCampus().CampusID;
            //var allBook = booksPanelService.GetAllBooksForReportByCampusID(validUserCampusId);
            var resourceTypes = defService.GetAllActiveResorceTypes();

            //var roman=allBook.Where()
            List<ResourceTypesDTO> criticalStocks = new List<ResourceTypesDTO>();

            foreach (var item in resourceTypes)
            {
                var allBooksCountByResourceTypeIDandCampusID = booksPanelService.GetAllBooksCountByResourceTypeIDandCampusID(item.ResourceTypeID, validUserCampusId);

                var allAvailableBooksCountByResourceTypeIDandCampusID = booksPanelService.GetAlllAvailableBooksCountByResourceTypeIDandCampusID(item.ResourceTypeID, validUserCampusId);

                var result = ((float)allAvailableBooksCountByResourceTypeIDandCampusID / (float)allBooksCountByResourceTypeIDandCampusID) * 100;
                if (result < 10)
                {
                    criticalStocks.Add(item);
                }

            }
            ViewBag.CriticalStocks = criticalStocks;

            return View();


        }
        public ActionResult CriticalStockReport(int resourceTypeID)
        {
            
            var validUserCampusId = Helper.Utility.GetValidUserCampus().CampusID;

            var resourceType = defService.GetAllActiveResorceTypes().Where(x=>x.ResourceTypeID==resourceTypeID).FirstOrDefault();

            var allBooksCountByResourceTypeIDandCampusID = booksPanelService.GetAllBooksCountByResourceTypeIDandCampusID((byte)resourceTypeID, validUserCampusId);

            var allAvailableBooksCountByResourceTypeIDandCampusID = booksPanelService.GetAlllAvailableBooksCountByResourceTypeIDandCampusID((byte)resourceTypeID, validUserCampusId);

            var result = ((float)allAvailableBooksCountByResourceTypeIDandCampusID / (float)allBooksCountByResourceTypeIDandCampusID) * 100;


                var data = (new ResourceTypesReportDTO
                {
                    ResourceTypeName = resourceType.ResourceTypeName,
                    AllBooksCount = allAvailableBooksCountByResourceTypeIDandCampusID,
                    AvailableBooksCount = allAvailableBooksCountByResourceTypeIDandCampusID,
                    Ratio = result,
                   
                });


                return PDF(data, "CriticalStockReport");

            
            

        }
        public ViewAsPdf PDF(ResourceTypesReportDTO data, string viewName)
        {
            var unix = DateTimeOffset.Now.ToUnixTimeMilliseconds();
            return new ViewAsPdf(viewName, data)
            {
                FileName = string.Format("{0}-{1}.pdf", data.ResourceTypeName, unix),
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
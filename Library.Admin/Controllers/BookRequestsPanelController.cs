﻿using Library.Admin.Filters;
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
            var validUser = Helper.Utility.GetValidUserInfo();
            var sortColumnIndex = Convert.ToInt32((HttpContext.Request["iSortCol_1"]));
            var sortDirection = HttpContext.Request["sSortDir_1"];//asc or desc

            Func<BookRequestListDTO, object> orderingFunction = (c => sortColumnIndex == 0 ? c.BookRequestID :
                                    sortColumnIndex == 1 ? c.Name :
                                    sortColumnIndex == 2 ? c.BookName :
                                    sortColumnIndex == 3 ? c.BookIsAvailable :
                                    sortColumnIndex == 4 ? c.IsActive : new object());

            var data = bookRequestsService.GetAllBookRequestsByCampusID(validUser.CampusID).Where(x=>x.IsAvailable==true);
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
                                      Helper.Utility.GetIsAvailable(c.BookIsAvailable),
                                      Helper.Utility.GetIsActive(c.IsActive),
                                      string.Format("<a  onclick='UpdateIsAvailable({0})' class='bold'> Update IsAvailable</a>",c.BookRequestID),
                                    };

            objDataTable.sEcho = parameters.sEcho;
            objDataTable.iTotalRecords = tempData.Count();
            objDataTable.iTotalDisplayRecords = tempData.Count();
            return objDataTable;
        }

        public JsonResult Edit(int bookRequestID)
        {
           
            BookRequestDTO currentBookRequest = bookRequestsService.GetBookRequestByID(bookRequestID);
            if (currentBookRequest.BookIsAvailable == true)
            {
                currentBookRequest.BookIsAvailable = false;
                currentBookRequest.IsActive = true;
            }
                

            else if(currentBookRequest.BookIsAvailable == false)
            {
                currentBookRequest.BookIsAvailable = true;
                currentBookRequest.IsActive = true;
            }
                

            var result = bookRequestsService.Update(currentBookRequest);

            BookRequestDTO currentBookRequest2 = bookRequestsService.GetBookRequestByID(bookRequestID);
            return Json("Book  isAvailable updated");
        }
    }
}
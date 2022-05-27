using Library.Admin.Filters;
using Library.Admin.Models;
using Library.Core;
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
    public class UserPanelController : Controller
    {
        private UserPanelService userPanelService = new UserPanelService();
        private DefinitionService defService = new DefinitionService();
        // GET: UserPanel
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult GetUsers(jQueryDataTableParam parameters)
        {
            var rData = GetUsersForWebView(parameters);

            return Json(new
            {
                sEcho = rData.sEcho,
                iTotalRecords = rData.iTotalRecords,
                iTotalDisplayRecords = rData.iTotalDisplayRecords,
                aaData = rData.aaData
            },
                JsonRequestBehavior.AllowGet);


        }
        private JsonDataTable GetUsersForWebView(jQueryDataTableParam parameters)
        {
            var sortColumnIndex = Convert.ToInt32((HttpContext.Request["iSortCol_1"]));
            var sortDirection = HttpContext.Request["sSortDir_1"];//asc or desc

            Func<UserListDTO, object> orderingFunction = (c => sortColumnIndex == 0 ? c.UserID :
                                    sortColumnIndex == 1 ? c.Name :
                                    sortColumnIndex == 2 ? c.Surname :
                                    sortColumnIndex == 3 ? c.Email :
                                    sortColumnIndex == 4 ? c.UserTypeID :
                                    sortColumnIndex == 5 ? c.CampusID :
                                    sortColumnIndex == 6 ? c.IsActive : new object());

            var data = userPanelService.GetAllUsers();
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
                tempData = tempData.Where(x => x.Surname.ToString().ToLower().Contains(isSurname.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isEmailAddress))
            {
                tempData = tempData.Where(x => x.Email.ToString().ToLower().Contains(isEmailAddress.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isUserTypeName))
            {
                tempData = tempData.Where(x => x.UserTypeName.ToString().ToLower().Contains(isUserTypeName.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(isCampusName))
            {
                tempData = tempData.Where(x => x.CampusName.ToString().ToLower().Contains(isCampusName.ToLower())).ToList();
            }
            

            tempData = sortDirection == "asc" ? tempData.OrderBy(orderingFunction).ToList() : tempData.OrderByDescending(orderingFunction).ToList();

            var displayedRecords = tempData.Skip(parameters.iDisplayStart).Take(parameters.iDisplayLength);

            var objDataTable = new JsonDataTable();
            var users = displayedRecords as UserListDTO[] ?? displayedRecords.ToArray();
            objDataTable.aaData = from c in users
                                  select new[]
                                    {

                                      c.Name,
                                      c.Surname,
                                      c.Email,
                                      c.UserTypeName,
                                      c.CampusName,
                                      Helper.Utility.GetIsActive(c.IsActive),
                                      string.Format("<a href='/UserPanel/Edit/{0}'class='bold'> Düzenle</a>",c.UserID),
                                    };

            objDataTable.sEcho = parameters.sEcho;
            objDataTable.iTotalRecords = tempData.Count();
            objDataTable.iTotalDisplayRecords = tempData.Count();
            return objDataTable;
        }
        public ActionResult Create()
        {
            var userTypes = defService.GetAllActiveUserTypes()?.OrderBy(x => x.UserTypeID).ToList();
            ViewBag.UserTypeID = new SelectList(userTypes, "UserTypeID", "UserTypeName");
            var campuses = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusName).ToList();
            ViewBag.CampusID = new SelectList(campuses, "CampusID", "CampusName");

            return View();
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(UserDTO model)
        {
            var userExist = userPanelService.GetByEmail(model.Email);
            if (userExist != null)
            {
                var userTypes = defService.GetAllActiveUserTypes()?.OrderBy(x => x.UserTypeID).ToList();
                ViewBag.UserTypeID = new SelectList(userTypes, "UserTypeID", "UserTypeName");
                var vendors = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusName).ToList();
                ViewBag.CampusID = new SelectList(vendors, "CampusID", "CampusName");

                return View(model);
            }
            else
            {
                model.IsActive = true;
                var password = model.PasswordHash;
                model.PasswordHash = MD5Hash.GetMd5Hash(model.PasswordHash);

                var result = userPanelService.Insert(model);

                if (result != null)
                {
                    //using (MailService mailService = new MailService())
                    //{
                    //    string mailTemplateUrl = "WelcomeUser.html";

                    //    var emailReponse = mailService.SendEmail(new EmailModel
                    //    {
                    //        Body = mailService.GetHtmlBody(mailTemplateUrl).
                    //           Replace("{FirstName}", model.Name).
                    //           Replace("{LastName}", model.Surname).
                    //           Replace("{Password}", password).
                    //           //Replace("{LogoUrl}", Helper.EtutanakValues.AppLogoUrl).
                    //           Replace("{WebsiteUrl}", Helper.LibraryValues.WebsiteUrl),
                    //        EmailAddress = model.Email,
                    //        Subject = "Darin E-tutanak Kullanıcı Giriş Bilgisi",
                    //        URL = "",
                    //    });
                    //}
                    return RedirectToAction("Index");
                }
                else
                {
                    var userTypes = defService.GetAllActiveUserTypes()?.OrderBy(x => x.UserTypeID).ToList();
                    ViewBag.UserTypeID = new SelectList(userTypes, "UserTypeID", "UserTypeName");
                    var vendors = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusName).ToList();
                    ViewBag.CampusID = new SelectList(vendors, "CampusID", "CampusName");

                    ViewBag.Error = "Error";
                    return View(model);
                }
            }
        }
        public ActionResult Edit(int id)
        {
            if (id<1)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserDTO user = userPanelService.GetByID(id);
            if (user == null)
                return HttpNotFound();

            ViewBag.UserTypes = defService.GetAllActiveUserTypes()?.OrderBy(x => x.UserTypeID).ToList();
            ViewBag.Campuses = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusID).ToList();
            return View(user);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(UserDTO user)
        {
            UserDTO currentUser = userPanelService.GetByID(user.UserID);
            if (string.IsNullOrEmpty(user.PasswordHash))
            {
                user.PasswordHash = currentUser.PasswordHash;
            }
            else
            {
                user.PasswordHash = MD5Hash.GetMd5Hash(user.PasswordHash);
            }

            var result = userPanelService.Update(user);
            if (result)
                return RedirectToAction("Index");

            ViewBag.UserTypes = defService.GetAllActiveUserTypes()?.OrderBy(x => x.UserTypeID).ToList();
            ViewBag.Campuses = defService.GetAllActiveCampuses()?.OrderBy(x => x.CampusID).ToList();
            ViewBag.Error = "Error";
            return View(user);
        }
    }
}
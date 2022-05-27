using Library.Admin.Filters;
using Library.Admin.Models;
using Library.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace Library.Admin.Controllers
{
    public class AccountController : Controller
    {
        private LibrarianService librarianService = new LibrarianService();

        // GET: Account
        public ActionResult Index()
        {
            return View();
        }
        [AllowAnonymous]
        public ActionResult Login()
        {
            var user = Helper.Utility.GetValidUserInfo();
            if (user != null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }
        [HttpPost]
        [AllowAnonymous]
        public ActionResult Login(LoginForm user)
        {
            string message = string.Empty;
            if (user.Email=="" || user.Password == "")
            {
                message = "Enter your email and/or password";
            }
            
            var validUser = librarianService.Authenticate(user.Email, user.Password);

            if (validUser == null || validUser.IsActive == false)
            {
                message = "Email or password is incorrect";
            }
            else if (validUser.UserTypeID == 2 || validUser.UserTypeID == 4)
            {
                JavaScriptSerializer serializer = new JavaScriptSerializer();

                validUser.PasswordHash = "";
                string userData = serializer.Serialize(validUser);

                //create cookie
                FormsAuthenticationTicket authTicket = new FormsAuthenticationTicket(1,
                    validUser.UserID.ToString(),
                    DateTime.Now,
                    DateTime.Now.AddMonths(1),
                    true,
                    userData
                    );

                //add cookie to response
                string encryptedTicket = FormsAuthentication.Encrypt(authTicket);
                string FormCookieName = "LibrarianUser" + FormsAuthentication.FormsCookieName;
                System.Web.HttpCookie authCookie = new System.Web.HttpCookie(FormCookieName, encryptedTicket);
                authCookie.HttpOnly = true;
                if (authTicket.IsPersistent)
                {
                    authCookie.Expires = authTicket.Expiration;
                }
                System.Web.HttpContext.Current.Response.Cookies.Add(authCookie);
                return RedirectToAction("Index", "Home");
            }
            else
            {
                message = "Email or password is incorrect";
            }
            ViewBag.Message = message;
            return View(user);
        }
        [LibrarianAuthorizeAttribute]
        public ActionResult Logout()
        {
            RemoveCookie($"LibrarianUser{FormsAuthentication.FormsCookieName}");
            FormsAuthentication.SignOut();

            return Json("/Account/Login");
        }
        private void RemoveCookie(string cookieName)
        {
            if (Request.Cookies[cookieName] != null)
            {
                System.Web.HttpCookie cookie = new System.Web.HttpCookie(cookieName);
                cookie.Expires = DateTime.Now.AddDays(-1);
                Response.Cookies.Add(cookie);
            }
        }
    }
}
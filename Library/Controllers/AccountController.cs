using Library.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace Library.Controllers
{
    public class AccountController : Controller
    {
        private UserService userService = new UserService();
        // GET: Account
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login()
        {
            var user = Library.Helpers.Utility.GetValidUserInfo();
            if (user != null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }
        [HttpPost]
        [AllowAnonymous]
        public ActionResult Login(Helpers.LoginModel user)
        {
            string message = string.Empty;
            if (user.Email == "" || user.Password == "")
            {
                message = "Enter your email and/or password";
            }
           
            var validUser = userService.Authenticate(user.Email, user.Password);

            if (validUser == null || validUser.IsActive == false)
            {
                message = "Email or password is incorrect";
            }
            else if(validUser.UserTypeID ==1 || validUser.UserTypeID == 3)
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
                string FormCookieName = "User" + FormsAuthentication.FormsCookieName;
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
                message = "You must be a student or guest.";
            }
            ViewBag.Message = message;
            return View(user);
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
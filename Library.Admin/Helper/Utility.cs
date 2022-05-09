using Library.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace Library.Admin.Helper
{
    public class Utility
    {
        public static UserDTO GetValidUserInfo()
        {
            var cookie = HttpContext.Current.Request.Cookies[$"LibrarianUser{FormsAuthentication.FormsCookieName}"];
            if (cookie == null)
            {
                return null;
            }
            var ticket = FormsAuthentication.Decrypt(cookie.Value);
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            var userData = serializer.Deserialize<UserDTO>(ticket.UserData);
            return userData;
        }
        public static string GetValidUserID()
        {
            var cookie = HttpContext.Current.Request.Cookies[$"LibrarianUser{FormsAuthentication.FormsCookieName}"];
            if (cookie == null)
            {
                return null;
            }
            var ticket = FormsAuthentication.Decrypt(cookie.Value);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var userData = serializer.Deserialize<UserDTO>(ticket.UserData);

            return userData.UserID.ToString();
        }
    }
}
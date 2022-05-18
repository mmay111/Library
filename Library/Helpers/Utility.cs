using Library.Data;
using Library.Data.UnitOfWork;
using Library.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Security;

namespace Library.Helpers
{
    public class Utility
    {
        public static UserDTO GetValidUserInfo()
        {
            var cookie = HttpContext.Current.Request.Cookies[$"User{FormsAuthentication.FormsCookieName}"];
            if (cookie == null)
            {
                return null;
            }
            var ticket = FormsAuthentication.Decrypt(cookie.Value);
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            var userData = serializer.Deserialize<UserDTO>(ticket.UserData);
            return userData;
        }
        public static int GetValidUserID()
        {
            var cookie = HttpContext.Current.Request.Cookies[$"User{FormsAuthentication.FormsCookieName}"];
            if (cookie == null)
            {
                return 0;
            }
            var ticket = FormsAuthentication.Decrypt(cookie.Value);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var userData = serializer.Deserialize<UserDTO>(ticket.UserData);


            return userData.UserID;
        }
        public static CampusDTO GetValidUserCampus()
        {
            var cookie = HttpContext.Current.Request.Cookies[$"User{FormsAuthentication.FormsCookieName}"];
            if (cookie == null)
            {
                return null;
            }
            var ticket = FormsAuthentication.Decrypt(cookie.Value);
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            var userData = serializer.Deserialize<UserDTO>(ticket.UserData);

            using (UnitOfWork uow = new UnitOfWork())
            {
                return uow.MapSingle<Campus, CampusDTO>(uow.Repository<Campus>().Single(x =>
                    x.CampusID == userData.CampusID

               ));
            }

        }
    }
    
}
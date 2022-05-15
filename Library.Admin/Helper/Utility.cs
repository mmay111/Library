
using Library.Data;
using Library.Data.UnitOfWork;
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
        public static CampusDTO GetValidUserCampus()
        {
            var cookie = HttpContext.Current.Request.Cookies[$"LibrarianUser{FormsAuthentication.FormsCookieName}"];
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
        public static string GetIsActive(bool type)
        {
            if (type == true)
                return "<span class='label label-sm label-success'>Aktif</span>";
            else if (type == false)
                return "<span class='label label-sm label-danger'>Pasif</span>";
            return "";
        }
        public static string GetIsAvailable(bool type)
        {
            if (type == true)
                return "<span class='label label-sm label-success'>Mevcut</span>";
            else if (type == false)
                return "<span class='label label-sm label-danger'>Mevcut değil</span>";
            return "";
        }
        public static string GetIsPrinted(bool type)
        {
            if (type == true)
                return "<span class='label label-sm label-success'>Basılı</span>";
            else if (type == false)
                return "<span class='label label-sm label-danger'>Online</span>";
            return "";
        }
        
    }
}
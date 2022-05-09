using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Library.Admin.Helper
{
    public class LibraryValues
    {
        public static readonly string AppName = "Kütüphane Sistemi";
        public static readonly string AppCreatedYear = "2022";
        public static readonly string WebsiteUrl = ConfigurationManager.AppSettings["WebsiteUrl"].ToString();
        //public static readonly string AppLogoUrl = $"{WebsiteUrl}/content/layouts/layout2/img/-logo.png";
    }
}
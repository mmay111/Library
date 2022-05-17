﻿using Library.DTO;
using Library.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Library.Filters
{
    public class UserAuthorizeAttribute : AuthorizeAttribute
    {
        private IEnumerable<byte> allowedRoles;
        public UserAuthorizeAttribute(params Library.DTO.Enums.UserType[] roles)
        {
            this.allowedRoles = roles.Select(x => (byte)x);
        }
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (FormsAuthentication.CookiesSupported)
            {
                var cookieName = "User" + FormsAuthentication.FormsCookieName;
                if (httpContext.Request.Cookies[cookieName] != null)
                {
                    FormsAuthenticationTicket ticket = FormsAuthentication.Decrypt(httpContext.Request.Cookies[cookieName].Value);
                    string userId = ticket.Name;
                    UserDTO user = null;
                    if (userId != null)
                    {
                        UserService userservice = new UserService();

                        var userInfo = userservice.GetByID(int.Parse(ticket.Name));
                        if (userInfo == null)
                        {
                            return false;
                        }
                        user = userInfo;
                    }
                    if (allowedRoles != null && allowedRoles.Count() > 0)
                    {
                        if (allowedRoles.Any(x => x == (user as UserDTO).UserTypeID))
                        {
                            return true;
                        }
                        return false;
                    }
                    return true;

                }
                return false;
            }
            return false;
        }
        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectResult("/Account/Login");
        }
    }
}
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Owin;
using System;
using System.Net;
using System.Threading.Tasks;

[assembly: OwinStartup(typeof(Library.Admin.App_Start.Startup))]

namespace Library.Admin.App_Start
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls |
                                SecurityProtocolType.Tls11 |
                                SecurityProtocolType.Tls12;
            app.SetDefaultSignInAsAuthenticationType(CookieAuthenticationDefaults.AuthenticationType);
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                LoginPath = new PathString("/Account/Login"),
                SlidingExpiration = true,
                Provider = new CookieAuthenticationProvider
                {
                    OnResponseSignIn = context =>
                    {
                        context.Properties.AllowRefresh = true;
                        context.Properties.ExpiresUtc = DateTimeOffset.Now.AddDays(30);
                    }
                }

            });
        }
    }
}

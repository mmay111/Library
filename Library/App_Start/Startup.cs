using Microsoft.Owin;
using Owin;
using System;
using System.Net;


using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;

using System.Threading.Tasks;

[assembly: OwinStartup(typeof(Library.App_Start.Startup))]

namespace Library.App_Start
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=316888
            
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

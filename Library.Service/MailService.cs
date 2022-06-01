using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Mail;
using System.Configuration;
using System.IO;
using Library.DTO;

namespace Library.Service
{
    public class MailService : IDisposable
    {
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }
        public string GetHtmlBody(string PathURL)
        {
            string filePath = "";
            string HtmlBody = "";
            filePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory.ToString() + "MailTemplate/" + PathURL);
            using (var sr = new StreamReader(filePath))
            {
                HtmlBody = sr.ReadToEnd();
            }
            return HtmlBody;
        }
        public bool SendEmail(EmailModel model)
        {
            Guid sendGuid = Guid.NewGuid();
            var host = ConfigurationManager.AppSettings["MailServer"];
            var port = Convert.ToInt32(ConfigurationManager.AppSettings["MailPort"]);
            var user = ConfigurationManager.AppSettings["MailUser"].ToString();
            var password = ConfigurationManager.AppSettings["MailPassword"];

            using (SmtpClient client = new SmtpClient
            {
                Host = host,
                Port = port,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,

                Credentials = new NetworkCredential(user, password)
            })
            {
                MailMessage mailMessage = new MailMessage();

                mailMessage.From = new MailAddress(ConfigurationManager.AppSettings["MailUser"], "Library");

                mailMessage.To.Add(model.EmailAddress);

                if (model.CC != null && model.CC.Count > 0)
                {
                    foreach (var item in model.CC)
                    {
                        if (!string.IsNullOrEmpty(item))
                        {
                            mailMessage.CC.Add(item);
                        }
                    }
                }
                mailMessage.Subject = model.Subject;
                mailMessage.IsBodyHtml = true;
                mailMessage.Body = model.Body;

                if (model.Attachment != null)
                {
                    mailMessage.Attachments.Add(model.Attachment);
                }
                client.Send(mailMessage);
            }
            return true;

        }
    }
}

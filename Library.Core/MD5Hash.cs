using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Library.Core
{
    public class MD5Hash
    {
        public static string GetMd5Hash(string data)
        {
            var bytes = Encoding.Default.GetBytes(data);
            using (var md5 = new MD5CryptoServiceProvider())
            {
                var cipher = md5.ComputeHash(bytes);
                return Convert.ToBase64String(cipher);
            }
        }
    }
}

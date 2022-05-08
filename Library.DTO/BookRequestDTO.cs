using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DTO
{
    public class BookRequestDTO
    {
        public int BookRequestID { get; set; }
        public int UserID { get; set; }
        public int BookID { get; set; }
        public bool IsActive { get; set; }
    }
}

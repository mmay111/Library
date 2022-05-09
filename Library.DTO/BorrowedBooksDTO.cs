using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DTO
{
    public class BorrowedBooksDTO
    {
        public int BorrowedBookID { get; set; }
        public int UserID { get; set; }
        public int BookID { get; set; }
        public int BookBorrowFeeID { get; set; }
        public System.DateTime BorrrowDate { get; set; }
        public System.DateTime BorrowExpiresDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsReturned { get; set; }
    }
}

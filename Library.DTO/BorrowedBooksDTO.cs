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
    public class BorrowedBooksListDTO
    {
        public int BorrowedBookID { get; set; }
        public int UserID { get; set; }
        public string Name { get; set; }
        public int BookID { get; set; }
        public string BookName { get; set; }
        public string Barcode { get; set; }
        public byte CampusID { get; set; }
        public string CampusName { get; set; }
        public string AuthorName { get; set; }
        public int BookBorrowFeeID { get; set; }
        public string BookBorrowFee { get; set; }
        public System.DateTime BorrrowDate { get; set; }
        public System.DateTime BorrowExpiresDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsReturned { get; set; }
    }
}

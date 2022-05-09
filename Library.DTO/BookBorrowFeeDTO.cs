using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DTO
{
    public class BookBorrowFeeDTO
    {
        public int BookBorrowFeeID { get; set; }
        public string BorrowFee { get; set; }
        public bool IsActive { get; set; }
        public int NumberOfDateBorrowed { get; set; }
    }
}

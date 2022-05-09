using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DTO
{
    public class BorrowedBooksMaxNumberDTO
    {
        public byte BorrowedBooksMaxNumberID { get; set; }
        public int maxNumber { get; set; }
        public bool IsActive { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DTO
{
    public class CampusDTO
    {
        public byte CampusID { get; set; }
        public string CampusName { get; set; }
        public bool IsActive { get; set; }
    }
    public class CampusReportDTO
    {
        public byte CampusID { get; set; }
        public string CampusName { get; set; }
        public int BooksCount { get; set; }
        public int AvailableBooksCount { get; set; }
        public int BorrowedBooksCount { get; set; }
        public bool IsActive { get; set; }
        public string DateStart { get; set; }
        public string DateFinish { get; set; }

        public static implicit operator List<object>(CampusReportDTO v)
        {
            throw new NotImplementedException();
        }
    }
}

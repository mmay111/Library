using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DTO
{
    public class BookDetailsDTO
    {
        public int BookDetailsID { get; set; }
        public int AuthorID { get; set; }
        public string Barcode { get; set; }
        public byte CampusID { get; set; }
        public byte ResourceTypeID { get; set; }
        public bool IsActive { get; set; }
        public bool IsAvailable { get; set; }
    }
}

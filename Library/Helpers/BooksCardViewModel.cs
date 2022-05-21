using Library.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Library.Helpers
{
    public class BooksCardViewModel
    {
        public int BookID { get; set; }
        public string BookName { get; set; }
        public int BookDetailsID { get; set; }
        public bool IsActive { get; set; }
        public int AuthorID { get; set; }
        public string AuthorName { get; set; }
        public string Summary { get; set; }
        public string Barcode { get; set; }
        public byte CampusID { get; set; }
        public string CampusName { get; set; }
        public byte ResourceTypeID { get; set; }
        public string ResourceTypeName { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsPrinted { get; set; }
        public BookDetailsDTO BookDetails { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Library.Helpers
{
    public class BooksViewModel
    {
        public bool IsCardView { get; set; }
        public List<BooksCardViewModel> Books { get; set; }
    }
}
//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Library.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class BorrowedBooks
    {
        public int BorrowedBookID { get; set; }
        public int UserID { get; set; }
        public int BookID { get; set; }
        public System.DateTime BorrrowDate { get; set; }
        public System.DateTime BorrowExpiresDate { get; set; }
        public bool IsActive { get; set; }
        public bool IsReturned { get; set; }
        public int BookBorrowFee { get; set; }
    
        public virtual Books Books { get; set; }
        public virtual User User { get; set; }
    }
}

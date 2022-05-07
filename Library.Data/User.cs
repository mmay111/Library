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
    
    public partial class User
    {
        public User()
        {
            this.BookRequest = new HashSet<BookRequest>();
            this.BorrowedBooks = new HashSet<BorrowedBooks>();
        }
    
        public int UserID { get; set; }
        public byte UserTypeID { get; set; }
        public byte CampusID { get; set; }
        public bool IsActive { get; set; }
    
        public virtual ICollection<BookRequest> BookRequest { get; set; }
        public virtual ICollection<BorrowedBooks> BorrowedBooks { get; set; }
        public virtual Campus Campus { get; set; }
        public virtual UserTypes UserTypes { get; set; }
    }
}

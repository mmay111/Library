using System;
using System.Collections.Generic;
using System.Linq;
using Library.Data;
using Library.Data.UnitOfWork;
using Library.DTO;
using System.Text;
using System.Threading.Tasks;

namespace Library.Service
{
    public class UserBorrowedBooksService
    {
        public List<BorrowedBooksListDTO> GetUserAllBorrowedBooks(int validUserId)
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Select(x => new BorrowedBooksListDTO
                {
                    BorrowedBookID = x.BorrowedBookID,
                    UserID = x.UserID,
                    AuthorName = x.Books.BookDetails.Author.AuthorName,
                    BookName = x.Books.BookName,
                    Barcode = x.Books.BookDetails.Barcode,
                    CampusName = x.User.Campus.CampusName,
                    BookBorrowFee = x.BookBorrowFee,
                    IsActive = x.IsActive,
                    BorrrowDate = x.BorrrowDate,
                    BorrowExpiresDate = x.BorrowExpiresDate,
                    IsReturned = x.IsReturned,
                }).Where(x=>x.UserID== validUserId).ToList();
                return borrowedBooks;
            }
        }
    }
}

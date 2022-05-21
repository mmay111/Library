using Library.Data;
using Library.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.Service
{
    public class BorrowedBooksService
    {
        public List<BorrowedBooks> GetTodaysBorrowedBooksByCampusID(int campusID)
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Where(b => b.BorrrowDate.Year == DateTime.Now.Year && b.BorrrowDate.Month == DateTime.Now.Month && b.BorrrowDate.Day == DateTime.Now.Day).Where(x => x.Books.BookDetails.CampusID == campusID && x.IsReturned == false && x.IsActive == true).ToList();
                return borrowedBooks;
            }
        }
        public List<BorrowedBooks> GetLastMonthBorrowedBooksByCampusID(int campusID)
        {
            var newDate = DateTime.Now.Date.AddDays(-30);
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Where(b => b.BorrrowDate >= newDate).Where(x => x.Books.BookDetails.CampusID == campusID && x.IsReturned == false && x.IsActive == true).ToList();
                return borrowedBooks;

            }
        }
        public List<BorrowedBooks> GetLastWeekBorrowedBooksByCampusID(int campusID)
        {
            var newDate = DateTime.Now.Date.AddDays(-7);
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Where(b => b.BorrrowDate >= newDate).Where(x => x.Books.BookDetails.CampusID == campusID && x.IsReturned == false && x.IsActive == true).ToList();
                return borrowedBooks;

            }
        }

    }
}

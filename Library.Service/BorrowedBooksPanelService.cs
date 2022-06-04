using Library.Data;
using Library.Data.UnitOfWork;
using Library.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.Service
{
    public class BorrowedBooksPanelService
    {
        public List<BorrowedBooksListDTO> GetAllBorrowedBooks()
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Select(x => new BorrowedBooksListDTO
                {
                    BorrowedBookID=x.BorrowedBookID,
                    UserID = x.UserID,
                    Name = x.User.Name,
                    //Surname = x.Surname,
                    AuthorName=x.Books.BookDetails.Author.AuthorName,
                    BookName = x.Books.BookName,
                    Barcode=x.Books.BookDetails.Barcode,
                    CampusName = x.User.Campus.CampusName,
                    BookBorrowFee = x.BookBorrowFee,
                    IsActive = x.IsActive,
                    BorrrowDate=x.BorrrowDate,
                    BorrowExpiresDate=x.BorrowExpiresDate,
                    IsReturned=x.IsReturned,
                    //FullName = x.Name + " " + x.Surname,
                }).ToList();
                return borrowedBooks;
            }
        }
        public List<BorrowedBooksListDTO> GetAllBorrowedBooksbyCampusID(int campusId)
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Select(x => new BorrowedBooksListDTO
                {
                    BorrowedBookID = x.BorrowedBookID,
                    UserID = x.UserID,
                    Name = x.User.Name+" "+x.User.Surname,
                    //Surname = x.Surname,
                    AuthorName = x.Books.BookDetails.Author.AuthorName,
                    BookName = x.Books.BookName,
                    Barcode = x.Books.BookDetails.Barcode,
                    CampusName = x.Books.BookDetails.Campus.CampusName,
                    CampusID = x.Books.BookDetails.CampusID,
                    BookBorrowFee = x.BookBorrowFee,
                    IsActive = x.IsActive,
                    BorrrowDate = x.BorrrowDate,
                    BorrowExpiresDate = x.BorrowExpiresDate,
                    IsReturned = x.IsReturned,
                    //FullName = x.Name + " " + x.Surname,
                }).Where(x=>x.CampusID==campusId).ToList();
                return borrowedBooks;
            }
        }
        public List<BorrowedBooks> GetTodaysBorrowedBooksByCampusID(int campusID)
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Where(b => b.BorrrowDate.Year == DateTime.Now.Year && b.BorrrowDate.Month == DateTime.Now.Month && b.BorrrowDate.Day == DateTime.Now.Day).Where(x => x.Books.BookDetails.CampusID == campusID && x.IsReturned == false && x.IsActive == true).ToList();
                return borrowedBooks;
            }
        }
        public List<BorrowedBooks> GetTodaysBorrowedBooksForAllCampus()
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Where(b => b.BorrrowDate.Year == DateTime.Now.Year && b.BorrrowDate.Month == DateTime.Now.Month && b.BorrrowDate.Day == DateTime.Now.Day).Where(x => x.IsReturned == false && x.IsActive == true).ToList();
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
        public List<BorrowedBooks> GetLastMonthBorrowedBooksForAllCampus()
        {
            var newDate = DateTime.Now.Date.AddDays(-30);
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Where(b => b.BorrrowDate >= newDate).Where(x => x.IsReturned == false && x.IsActive == true).ToList();
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
        public List<BorrowedBooks> GetLastWeekBorrowedBooksForAllCampus()
        {
            var newDate = DateTime.Now.Date.AddDays(-7);
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Where(b => b.BorrrowDate >= newDate).Where(x => x.IsReturned == false && x.IsActive == true).ToList();
                return borrowedBooks;

            }
        }
        public BorrowedBooksDTO GetByID(int borrowedBookId, bool? isActive = null)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                return uow.MapSingle<BorrowedBooks, BorrowedBooksDTO>(uow.Repository<BorrowedBooks>().Single(x =>
                 x.BorrowedBookID == borrowedBookId
                ));
            }
        }
        public int GetBorrowedBooksCountByUserID(int userId)
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var borrowedBooks = db.BorrowedBooks.Where(b => b.UserID == userId && b.IsReturned==false && b.IsActive==true).ToList();
                return borrowedBooks.Count();

            }
        }
        public bool Update(BorrowedBooksDTO obj)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                uow.Repository<BorrowedBooks>().Update(uow.MapSingle<BorrowedBooksDTO, BorrowedBooks>(obj));
                var commit = uow.Commit();
                return commit == -1 ? true : false;
            }
        }
        public BorrowedBooksDTO Insert(BorrowedBooksDTO obj)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                var result = uow.Repository<BorrowedBooks>().Insert(uow.MapSingle<BorrowedBooksDTO, BorrowedBooks>(obj));
                var commit = uow.Commit();
                if (commit == -1)
                {
                    return uow.MapSingle<BorrowedBooks, BorrowedBooksDTO>(result);
                }
                return null;
            }
        }
        
        public BookBorrowFeeDTO GetBookBorrowFeeById(int feeId)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                return uow.MapSingle<BookBorrowFee, BookBorrowFeeDTO>(uow.Repository<BookBorrowFee>().Single(x =>
                 x.BookBorrowFeeID == feeId
                ));
            }
        }
       

    }
}

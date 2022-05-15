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
                    BookBorrowFee = x.BookBorrowFee.BorrowFee,
                    IsActive = x.IsActive,
                    BorrrowDate=x.BorrrowDate,
                    BorrowExpiresDate=x.BorrowExpiresDate,
                    IsReturned=x.IsReturned,
                    //FullName = x.Name + " " + x.Surname,
                }).ToList();
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
        public bool Update(BorrowedBooksDTO obj)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                uow.Repository<BorrowedBooks>().Update(uow.MapSingle<BorrowedBooksDTO, BorrowedBooks>(obj));
                var commit = uow.Commit();
                return commit == -1 ? true : false;
            }
        }

    }
}

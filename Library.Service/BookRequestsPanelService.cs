using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Library.Data;
using Library.Data.UnitOfWork;
using Library.DTO;

namespace Library.Service
{
    public class BookRequestsPanelService : BaseService
    {
        public List<BookRequestListDTO> GetAllBookRequestsByCampusID(int campusId)
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var bookRequests = db.BookRequest.Select(x => new BookRequestListDTO
                {
                    BookRequestID = x.BookRequestID,
                    Name = x.User.Name,
                    Surname = x.User.Surname,
                    BookName = x.Books.BookName,
                    IsAvailable = x.Books.BookDetails.IsAvailable,
                    IsActive = x.IsActive,
                    BookIsAvailable=x.BookIsAvailable,
                    CampusID=x.Books.BookDetails.CampusID,
                    
                    //FullName = x.Name + " " + x.Surname,
                }).Where(x=>x.CampusID==campusId).ToList();
                return bookRequests;
            }
        }
        public List<BookRequestListDTO> GetBookRequestByUserID(int userId)
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var bookRequest = db.BookRequest.Where(x => x.UserID == userId && x.IsActive == true && x.BookIsAvailable==true).Select(x => new BookRequestListDTO
                {
                    UserID=x.UserID,
                    BookRequestID=x.BookRequestID,
                    BookName=x.Books.BookName,
                    IsActive=x.IsActive,


                }).ToList();
                    
                return bookRequest;
            }       
        }
        public BookRequestDTO GetBookRequestByID(int bookRequestId)
        {
            
            using (UnitOfWork uow = new UnitOfWork())
            {
                return uow.MapSingle<BookRequest, BookRequestDTO>(uow.Repository<BookRequest>().Single(x => x.BookRequestID == bookRequestId));
            }
        }
        public bool Update(BookRequestDTO obj)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                uow.Repository<BookRequest>().Update(uow.MapSingle<BookRequestDTO, BookRequest>(obj));
                var commit = uow.Commit();
                return commit == -1 ? true : false;
            }
        }
        public BookRequestDTO Insert(BookRequestDTO obj)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                var result = uow.Repository<BookRequest>().Insert(uow.MapSingle<BookRequestDTO, BookRequest>(obj));
                var commit = uow.Commit();
                if (commit == -1)
                {
                    return uow.MapSingle<BookRequest, BookRequestDTO>(result);
                }
                return null;
            }
        }
        public bool UpdateBookRequestIsAvailable(BookRequestDTO obj)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                uow.Repository<BookRequest>().Update(uow.MapSingle<BookRequestDTO, BookRequest>(obj));
                var commit = uow.Commit();
                return commit == -1 ? true : false;
            }
        }

    }
}

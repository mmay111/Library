using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Library.Data;
using Library.DTO;

namespace Library.Service
{
    public class BookRequestsPanelService : BaseService
    {
        public List<BookRequestListDTO> GetAllBookRequests()
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
                    //FullName = x.Name + " " + x.Surname,
                }).ToList();
                return bookRequests;
            }
        }
    }
}

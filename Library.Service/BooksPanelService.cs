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
    public class BooksPanelService : BaseService
    {
        public List<BooksListDTO> GetAllBooks()
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var books = db.Books.Select(x => new BooksListDTO
                {
                    BookID = x.BookID,
                    BookName = x.BookName,
                    AuthorName=x.BookDetails.Author.AuthorName,
                    Barcode = x.BookDetails.Barcode,
                    ResourceTypeName = x.BookDetails.ResourceTypes.ResourceTypeName,
                    CampusName = x.BookDetails.Campus.CampusName,
                    IsAvailable = x.BookDetails.IsAvailable,
                    IsPrinted = x.BookDetails.IsPrinted,
                    IsActive = true,
                }).ToList();
                return books;
            }
        }
        public int GetBooksCountByCampusID(int campusID)
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var count = db.Books.Where(x=>x.BookDetails.CampusID==campusID && x.IsActive==true).Count();
                return count;
            }
        }
        
        public BooksListDTO GetByID(int bookID)
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var books = db.Books.Where(x=>x.BookID==bookID).Select(x => new BooksListDTO
                {
                    BookID = x.BookID,
                    BookName = x.BookName,
                    AuthorName = x.BookDetails.Author.AuthorName,
                    Summary=x.BookDetails.Summary,
                    Barcode = x.BookDetails.Barcode,
                    ResourceTypeName = x.BookDetails.ResourceTypes.ResourceTypeName,
                    CampusID=x.BookDetails.CampusID,
                    ResourceTypeID=x.BookDetails.ResourceTypeID,
                    AuthorID=x.BookDetails.AuthorID,
                    CampusName = x.BookDetails.Campus.CampusName,
                    IsAvailable = x.BookDetails.IsAvailable,
                    IsPrinted = x.BookDetails.IsPrinted,
                    IsActive = x.IsActive,
                }).FirstOrDefault();
                return books;
            }
        }
        public BooksDTO GetByID2(int bookID, bool? isActive = null)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                return uow.MapSingle<Books, BooksDTO>(uow.Repository<Books>().Single(x =>
                 x.BookID == bookID &&
                 (
                     (isActive != null && x.IsActive == isActive.Value) || (isActive == null)
                 )
                ));
            }
        }
        public bool Insert(BooksListDTO obj)
        {
            using (LibraryEntities db=new LibraryEntities())
            {
                using (var dbContextTransaction = db.Database.BeginTransaction())
                {
                    using (UnitOfWork uow = new UnitOfWork())
                    {
                        try
                        {
                            if (obj.AuthorID == 0)
                            {
                                AuthorDTO authorModel = new AuthorDTO
                                {
                                    AuthorName = obj.AuthorName,
                                };
                                var authorResult = uow.Repository<Author>().Insert(uow.MapSingle<AuthorDTO, Author>(authorModel));
                                //var commit = uow.Commit();
                                obj.AuthorID = authorResult.AuthorID;
                            }

                            BookDetailsDTO bookDetailsModel = new BookDetailsDTO
                            {
                                Summary = obj.Summary,
                                AuthorID=obj.AuthorID,
                                Barcode=obj.Barcode,
                                CampusID=obj.CampusID,
                                ResourceTypeID=obj.ResourceTypeID,
                                IsActive=true,
                                IsAvailable=obj.IsAvailable,
                                IsPrinted=obj.IsPrinted,
                            };
                            var bookDetailsResult = uow.Repository<BookDetails>().Insert(uow.MapSingle<BookDetailsDTO, BookDetails>(bookDetailsModel));
                            //var commit = uow.Commit();
                            obj.BookDetailsID = bookDetailsResult.BookDetailsID;

                            BooksDTO booksModel = new BooksDTO
                            {
                                BookDetailsID=obj.BookDetailsID,
                                BookName=obj.BookName,

                            };
                            var bookResult = uow.Repository<Books>().Insert(uow.MapSingle<BooksDTO, Books>(booksModel));

                            var commit = uow.Commit();

                            var saved = db.SaveChanges();

                            dbContextTransaction.Commit();

                            return true;


                        }
                        catch (Exception)
                        {

                            dbContextTransaction.Rollback();
                            return false;
                        }
                    }
                        
                }
            }
            //using (UnitOfWork uow = new UnitOfWork())
            //{
            //    var result = uow.Repository<Books>().Insert(uow.MapSingle<BooksListDTO, Books>(obj));
            //    var commit = uow.Commit();
            //    if (commit == -1)
            //    {
            //        return uow.MapSingle<Books, BooksListDTO>(result);
            //    }
            //    return null;
            //}
        }
        public bool Update(BooksListDTO obj)
        {
            
                //uow.Repository<User>().Update(uow.MapSingle<UserDTO, User>(obj));
                //var commit = uow.Commit();
                //return commit == -1 ? true : false;
            
            using (LibraryEntities db = new LibraryEntities())
            {
                using (var dbContextTransaction = db.Database.BeginTransaction())
                {
                    using (UnitOfWork uow = new UnitOfWork())
                    {
                        try
                        {
                            if (obj.AuthorID == 0)
                            {
                                AuthorDTO authorModel = new AuthorDTO
                                {
                                    AuthorName = obj.AuthorName,
                                };
                                var authorResult = uow.Repository<Author>().Insert(uow.MapSingle<AuthorDTO, Author>(authorModel));
                                //var commit = uow.Commit();
                                obj.AuthorID = authorResult.AuthorID;
                            }

                            BookDetailsDTO bookDetailsModel = new BookDetailsDTO
                            {
                                Summary = obj.Summary,
                                AuthorID = obj.AuthorID,
                                Barcode = obj.Barcode,
                                CampusID = obj.CampusID,
                                ResourceTypeID = obj.ResourceTypeID,
                                IsActive = true,
                                IsAvailable = obj.IsAvailable,
                                IsPrinted = obj.IsPrinted,
                            };
                            var bookDetailsResult = uow.Repository<BookDetails>().Update(uow.MapSingle<BookDetailsDTO, BookDetails>(bookDetailsModel));
                            //var commit = uow.Commit();

                            BooksDTO booksModel = new BooksDTO
                            {
                                BookName = obj.BookName,

                            };
                            var bookResult = uow.Repository<Books>().Update(uow.MapSingle<BooksDTO, Books>(booksModel));

                            var commit = uow.Commit();

                            var saved = db.SaveChanges();

                            dbContextTransaction.Commit();

                            return true;


                        }
                        catch (Exception)
                        {

                            dbContextTransaction.Rollback();
                            return false;
                        }
                    }

                }
            }
        }
        

    }
}

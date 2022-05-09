using Library.Core;
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
    public class LibrarianService
    {
        public UserDTO GetByID(int userID, bool? isActive = null)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                return uow.MapSingle<User, UserDTO>(uow.Repository<User>().Single(x =>
                 x.UserID == userID &&
                 (
                     (isActive != null && x.IsActive == isActive.Value) || (isActive == null)
                 )
                ));
            }
        }
        public UserDTO Authenticate(string email, string password)
        {
            string md5Password = MD5Hash.GetMd5Hash(password);
            using (LibraryEntities db = new LibraryEntities())
            {
                var users = db.User.Where(x => x.Email == email && x.PasswordHash == md5Password);
                return Map(users);
            }

        }
        public UserDTO Map(IQueryable<User> users)
        {

            return users.Select(x => new UserDTO
            {
                UserID=x.UserID,
                TC=x.TC,
                Name=x.Name,
                Surname=x.Surname,
                Email = x.Email,
                PasswordHash=x.PasswordHash,
                UserTypeID=x.UserTypeID,
                CampusID=x.CampusID,
                IsActive = x.IsActive,
                
            }).FirstOrDefault();
        }
    }
}

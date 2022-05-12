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
    public class UserPanelService : BaseService
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
        public List<UserListDTO> GetAllUsers()
        {
            using (LibraryEntities db = new LibraryEntities())
            {
                var users = db.User.Select(x => new UserListDTO
                {
                    UserID = x.UserID,
                    Name = x.Name,
                    Surname = x.Surname,
                    Email = x.Email,
                    CampusName = x.Campus.CampusName,
                    UserTypeName = x.UserTypes.UserTypeName,
                    IsActive = x.IsActive,
                    //FullName = x.Name + " " + x.Surname,
                }).ToList();
                return users;
            }
        }
        public UserDTO GetByEmail(string email, bool? isActive = null)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                return uow.MapSingle<User, UserDTO>(uow.Repository<User>().Single(x =>
                    x.Email == email &&
                    (
                        (isActive != null && x.IsActive == isActive.Value) ||
                        (isActive == null)
                    )
               ));
            }

        }
        public UserDTO Insert(UserDTO obj)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                var result = uow.Repository<User>().Insert(uow.MapSingle<UserDTO, User>(obj));
                var commit = uow.Commit();
                if (commit == -1)
                {
                    return uow.MapSingle<User, UserDTO>(result);
                }
                return null;
            }
        }
        public bool Update(UserDTO obj)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                uow.Repository<User>().Update(uow.MapSingle<UserDTO, User>(obj));
                var commit = uow.Commit();
                return commit == -1 ? true : false;
            }
        }
    }
}

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
    public class AuthorsPanelService
    {
        public AuthorDTO GetByName(string name, bool? isActive = null)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                return uow.MapSingle<Author, AuthorDTO>(uow.Repository<Author>().Single(x =>
                    x.AuthorName == name.Trim()
                   
               ));
            }

        }
        public bool Update(AuthorDTO obj)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                uow.Repository<Author>().Update(uow.MapSingle<AuthorDTO, Author>(obj));
                var commit = uow.Commit();
                return commit == -1 ? true : false;
            }
        }
        public AuthorDTO Insert(AuthorDTO obj)
        {
            using (UnitOfWork uow = new UnitOfWork())
            {
                var result = uow.Repository<Author>().Insert(uow.MapSingle<AuthorDTO, Author>(obj));
                var commit = uow.Commit();
                if (commit == -1)
                {
                    return uow.MapSingle<Author, AuthorDTO>(result);
                }
                return null;
            }
        }
    }
}

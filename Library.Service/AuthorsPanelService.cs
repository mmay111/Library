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
    public class AuthorsPanelService : BaseService
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
    }
}

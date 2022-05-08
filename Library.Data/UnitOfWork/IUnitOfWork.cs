using Library.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.Data.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        Repository<T> Repository<T>() where T : class;

        int Commit();

        void RollBack();

        T MapSingle<S, T>(object source);

        List<T> MapList<S, T>(object source);
    }
}

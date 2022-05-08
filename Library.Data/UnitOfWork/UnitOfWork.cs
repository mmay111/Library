using Library.Data.Repository;
using System;
using System.Collections.Generic;
using AutoMapper;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;

namespace Library.Data.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private LibraryEntities db;

        private DbContextTransaction transaction;

        public UnitOfWork()
        {
            db = new LibraryEntities();
        }

        public Repository<T> Repository<T>() where T : class
        {
            return new Repository<T>(db);
        }

        public int Commit()
        {
            try
            {
                transaction = db.Database.BeginTransaction();
                db.SaveChanges();

                transaction.Commit();
                return -1;
            }
            catch (Exception ex)
            {
                RollBack();
                return 0;
            }
        }
        public int SaveChanges()
        {
            try
            {
                var s = db.SaveChanges();
                return s > 0 ? -1 : 0;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public void RollBack()
        {
            transaction.Rollback();
        }

        public void Dispose()
        {
            db.Dispose();
        }


        public T MapSingle<S, T>(object source)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<S, T>();
            });

            AutoMapper.IMapper mapper = config.CreateMapper();
            var result = mapper.Map<S, T>((S)source);

            return result;
        }

        public List<T> MapList<S, T>(object source)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<S, T>();
            });

            AutoMapper.IMapper mapper = config.CreateMapper();
            var result = mapper.Map<List<S>, List<T>>((List<S>)source);

            return result;
        }
    }
}

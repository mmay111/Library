using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Data.Entity;



namespace Library.Data.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private LibraryEntities _db;


        public Repository(LibraryEntities db)
        {
            _db = db;
        }

        public List<T> GetAll()
        {
            return _db.Set<T>().AsNoTracking().ToList();
        }
        public IQueryable<T> Query()
        {
            return _db.Set<T>();
        }

        public List<T> Search(Expression<Func<T, bool>> predicate)
        {
            return _db.Set<T>().AsNoTracking().Where(predicate).ToList();
        }
        public List<T> SearchWithoutAsNoTracking(Expression<Func<T, bool>> predicate)
        {
            return _db.Set<T>().Where(predicate).ToList();
        }
        public bool Any(Expression<Func<T, bool>> predicate)
        {
            return _db.Set<T>().AsNoTracking().Any(predicate);
        }
        public T Single(Expression<Func<T, bool>> predicate)
        {
            return _db.Set<T>().AsNoTracking().FirstOrDefault(predicate);
        }
        public T LastSingle(Expression<Func<T, DateTime>> predicate2, Expression<Func<T, bool>> predicate)
        {
            return _db.Set<T>().AsNoTracking().OrderByDescending(predicate2).FirstOrDefault(predicate);
        }
        public T Find(long id)
        {
            return _db.Set<T>().Find(id);
        }
        public T FindGuidKey(Guid id)
        {
            return _db.Set<T>().Find(id);
        }

        public T Update(T entity)
        {
            _db.Entry(entity).State = System.Data.Entity.EntityState.Modified;
            return entity;
        }
        //public void UpdateMatchEntity2(T updateEntity, T setEntity)
        //{
        //    //updateEntity: Varolan hali, setEntity: Güncellenmiş hali
        //    if (setEntity == null)
        //        throw new ArgumentNullException(nameof(setEntity));

        //    if (updateEntity == null)
        //        throw new ArgumentNullException(nameof(updateEntity));



        //    _db.Entry(updateEntity).CurrentValues.SetValues(setEntity);//Tüm kayıtlar, kolon eşitlemesine gitmeden bir entity'den diğerine atanır.
        //    foreach (var propertyName in _db.Entry(setEntity).CurrentValues.PropertyNames)
        //    {
        //        Console.WriteLine("Property Name: {0}", propertyName);
        //        //get original value
        //        var orgVal = _db.Entry(setEntity).OriginalValues[propertyName];

        //        //get current values
        //        var curVal = _db.Entry(setEntity).CurrentValues[propertyName];

        //        Console.WriteLine("     Current Value: {0}", curVal);
        //    }
        //    //foreach (var property in _db.Entry(setEntity).Properties)
        //    //{
        //    //    if (property.CurrentValue == null) { _db.Entry(updateEntity).Property(property.Metadata.Name).IsModified = false; }
        //    //}

        //    _db.SaveChanges();
        //}
        public void UpdateMatchEntity(T updateEntity)
        {
            //var entry = _db.Entry(updateEntity);

            foreach (var propertyName in _db.Entry(updateEntity).CurrentValues.PropertyNames)
            {
                Console.WriteLine("Property Name: {0}", propertyName);
                //get original value
                var orgVal = _db.Entry(updateEntity).OriginalValues[propertyName];

                //get current values
                var curVal = _db.Entry(updateEntity).CurrentValues[propertyName];
                if (orgVal.Equals(curVal))
                {
                    _db.Entry(updateEntity).Property(propertyName).IsModified = false;

                }

                Console.WriteLine("     Current Value: {0}", curVal);
            }

            _db.SaveChanges();
        }

        public T Insert(T entity)
        {
            return _db.Set<T>().Add(entity);
        }
        public IEnumerable<T> Insert(IEnumerable<T> entity)
        {
            return _db.Set<T>().AddRange(entity);
        }

        public void Delete(T entity)
        {
            _db.Entry(entity).State = System.Data.Entity.EntityState.Deleted;
        }
        public void Delete(IEnumerable<T> entity)
        {
            _db.Set<T>().RemoveRange(entity);
        }
        public IEnumerable<T> Get(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string includeProperties = "")
        {
            IQueryable<T> query = _db.Set<T>();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (includeProperties != null)
            {
                foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
            }

            if (orderBy != null)
            {
                return orderBy(query).ToList();
            }
            else
            {
                return query.ToList();
            }
        }
        public IQueryable<T> GetQuery(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string includeProperties = "")
        {
            IQueryable<T> query = _db.Set<T>();

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (includeProperties != null)
            {
                foreach (var includeProperty in includeProperties.Split
                (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
            }

            if (orderBy != null)
            {
                return orderBy(query);
            }
            else
            {
                return query;
            }
        }

        public T Single(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public List<T> Search(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<T> Get(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null, string includeProperties = "")
        {
            throw new NotImplementedException();
        }
    }
}

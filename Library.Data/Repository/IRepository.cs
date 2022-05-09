using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace Library.Data.Repository
{
    public interface IRepository<T> where T : class
    {
        List<T> GetAll();
        T Insert(T entity);
        T Update(T entity);
        T Find(long id);
        T Single(Expression<Func<T, bool>> predicate);
        List<T> Search(Expression<Func<T, bool>> predicate);
        void Delete(T entity);
        IEnumerable<T> Get(
        Expression<Func<T, bool>> filter = null,
        Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
        string includeProperties = "");

        void UpdateMatchEntity(T updateEntity);
    }
}


using System;
using System.Collections.Generic;
using System.Runtime.Caching;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.Core.Caching
{
    public class InMemoryCache : ICacheService, IDisposable
    {
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }

        public T GetOrSet<T>(string cacheKey, Func<T> getItemCallback, int duration, bool clearAndRefresh = false) where T : class
        {
            if (clearAndRefresh)
            {
                MemoryCache.Default.Remove(cacheKey);
            }
            T item = MemoryCache.Default.Get(cacheKey) as T;
            if (item == null)
            {
                item = getItemCallback();
                MemoryCache.Default.Add(cacheKey, item, DateTime.Now.AddMinutes(duration));
            }
            return item;
        }
        public void Remove(string cacheKey)
        {
            MemoryCache.Default.Remove(cacheKey);
        }
    }
}

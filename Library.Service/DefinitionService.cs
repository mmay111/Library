using Library.Core.Caching;
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
    class CacheKeys
    {
        public static readonly string AllActiveUserTypes = "AllActiveUserTypes";
        public static readonly string AllActiveCampuses = "AllActiveCampuses";
        public static readonly string CampusByID = "CampusByID";
        public static readonly string AllActiveResourceTypes = "AllActiveResourceTypes";
        public static readonly string AllActiveBookBorrowFee = "AllActiveBookBorrowFee";
    }
    public class DefinitionService : BaseService
    {
        
        public List<UserTypesDTO> GetAllActiveUserTypes()//for admin-
        {
            using (InMemoryCache cacheService = new InMemoryCache())
            {
                using (UnitOfWork uow = new UnitOfWork())
                {
                    return cacheService.GetOrSet(CacheKeys.AllActiveUserTypes, () => uow.MapList<UserTypes, UserTypesDTO>(uow.Repository<UserTypes>().Search(x => x.IsActive == true)), 15);
                }

            }
        }
        public List<UserTypesDTO> GetAllActiveUserTypesForLibrarian()
        {
            using (InMemoryCache cacheService = new InMemoryCache())
            {
                using (UnitOfWork uow = new UnitOfWork())
                {
                    return cacheService.GetOrSet(CacheKeys.AllActiveUserTypes, () => uow.MapList<UserTypes, UserTypesDTO>(uow.Repository<UserTypes>().Search(x => x.IsActive == true && (x.UserTypeID==1 ||x.UserTypeID==2))), 15);
                }

            }
        }
        public List<CampusDTO> GetAllActiveCampuses()
        {
            using (InMemoryCache cacheService = new InMemoryCache())
            {
                using (UnitOfWork uow = new UnitOfWork())
                {
                    return cacheService.GetOrSet(CacheKeys.AllActiveCampuses, () => uow.MapList<Campus, CampusDTO>(uow.Repository<Campus>().Search(x => x.IsActive == true)), 15);
                }
            }
        }
        public CampusDTO GetCampusByID(int campusID)
        {
            using (InMemoryCache cacheService = new InMemoryCache())
            {
                using (UnitOfWork uow = new UnitOfWork())
                {
                    return cacheService.GetOrSet(CacheKeys.CampusByID, () => uow.MapList<Campus, CampusDTO>(uow.Repository<Campus>().Search(x => x.CampusID == campusID)).FirstOrDefault(), 15);
                }
            }
        }
        public List<ResourceTypesDTO> GetAllActiveResorceTypes()
        {
            using (InMemoryCache cacheService = new InMemoryCache())
            {
                using (UnitOfWork uow = new UnitOfWork())
                {
                    return cacheService.GetOrSet(CacheKeys.AllActiveResourceTypes, () => uow.MapList<ResourceTypes, ResourceTypesDTO>(uow.Repository<ResourceTypes>().Search(x => x.IsActive == true)), 15);
                }
            }
        }
        public List<BookBorrowFeeDTO> GetAllActiveBookBorrowFees()
        {
            using (InMemoryCache cacheService = new InMemoryCache())
            {
                using (UnitOfWork uow = new UnitOfWork())
                {
                    return cacheService.GetOrSet(CacheKeys.AllActiveBookBorrowFee, () => uow.MapList<BookBorrowFee, BookBorrowFeeDTO > (uow.Repository<BookBorrowFee>().Search(x => x.IsActive == true)), 15);
                }
            }
        }

    }
}

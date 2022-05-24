using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DTO
{
    public class ResourceTypesDTO
    {
        public byte ResourceTypeID { get; set; }
        public string ResourceTypeName { get; set; }
        public bool IsActive { get; set; }
    }
    public class ResourceTypesReportDTO
    {
        public byte ResourceTypeID { get; set; }
        public string ResourceTypeName { get; set; }
        public int AllBooksCount { get; set; }
        public int AvailableBooksCount { get; set; }

        public float Ratio { get; set; }
        public bool IsActive { get; set; }
    }
}

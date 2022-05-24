using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DTO
{
    public class BookRequestDTO
    {
        public int BookRequestID { get; set; }
        public int UserID { get; set; }
        public int BookID { get; set; }
        public bool IsActive { get; set; }
        public bool BookIsAvailable { get; set; }
    }
    public class BookRequestListDTO
    {
        public int BookRequestID { get; set; }
        public int UserID { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public int BookID { get; set; }
        public string BookName { get; set; }
        public bool IsAvailable { get; set; }
        public bool IsActive { get; set; }
        public bool BookIsAvailable { get; set; }
        public int CampusID { get; set; }
    }
}

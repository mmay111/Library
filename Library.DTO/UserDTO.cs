using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DTO
{
    public class UserDTO
    {
        public int UserID { get; set; }
        public string TC { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public byte UserTypeID { get; set; }
        public byte CampusID { get; set; }
        public bool IsActive { get; set; }
    }
    public class UserListDTO
    {
        public int UserID { get; set; }
        public string TC { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public byte UserTypeID { get; set; }
        public string UserTypeName { get; set; }
        public byte CampusID { get; set; }
        public string CampusName { get; set; }

        public bool IsActive { get; set; }
    }
}

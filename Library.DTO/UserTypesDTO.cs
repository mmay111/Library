using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Library.DTO
{
    public class UserTypesDTO
    {
        public byte UserTypeID { get; set; }
        public string UserTypeName { get; set; }
        public bool IsActive { get; set; }
    }
}

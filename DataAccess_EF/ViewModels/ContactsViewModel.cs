using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess_EF.ViewModels
{
    /// <summary>
    /// Used to convert the result of the SP_GetContactInfo store procedure to object/s
    /// </summary>
    public class ContactsViewModel
    {
        public int id { get; set; }
        public string title { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string position { get; set; }
        public string directDial { get; set; }
        public Nullable<int> extension { get; set; }
        public string email { get; set; }
        public string status { get; set; }
        public string notes { get; set; }
        public Nullable<int> customerSupplierId { get; set; }        
        public string customerSupplierName { get; set; }
        public string others { get; set; }
    }
}

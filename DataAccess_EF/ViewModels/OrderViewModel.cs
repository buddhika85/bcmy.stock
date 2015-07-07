using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess_EF.ViewModels
{
    // view model for order records
    public class OrderViewModel
    {
        // from the model
        public int id { get; set; }
        public string type { get; set; }
        public string status { get; set; }
        public Nullable<decimal> total { get; set; }
        public Nullable<int> contactId { get; set; }
        public System.DateTime creationDateTime { get; set; }

        // view model - extra attributes
        public int? companyId { get; set; }                 // customerSupplier
        public string company { get; set; }
        public string contactFulName { get; set; }          // contact
        public string orderCreationDate { get; set; }
        public string orderCreationTime { get; set; }
    }
}

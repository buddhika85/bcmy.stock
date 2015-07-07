using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess_EF.ViewModels
{
    // Splits date time, contact, company comparing model
    public class NegotiationViewModel
    {
        // from model
        public int id { get; set; }
        public int productId { get; set; }
        public Nullable<decimal> quantity { get; set; }
        public Nullable<decimal> negotiatedPricePerItem { get; set; }        
        public Nullable<decimal> totalAmount { get; set; }
        public string status { get; set; }
        public System.DateTime negotiationDateTime { get; set; }
        public Nullable<int> orderId { get; set; }

        // date time splitting
        public string date { get; set; }
        public string time { get; set; }

        // customer info
        public int? customerSupplierId { get; set; }
        public int? contactId { get; set; }
        public string cusomerSupplierName { get; set; }
        public string contactName { get; set; }
    }
}

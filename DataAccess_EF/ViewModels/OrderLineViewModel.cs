using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess_EF.ViewModels
{
    public class OrderLineViewModel
    {
        public int id { get; set; }
        public int productId { get; set; }
        public Nullable<decimal> quantity { get; set; }
        public Nullable<decimal> negotiatedPricePerItem { get; set; }
        public Nullable<decimal> totalAmount { get; set; }
        public string status { get; set; }
        public string orderLineQuantityStatus { get; set; }
        public System.DateTime orderlineDateTime { get; set; }
        public Nullable<int> orderId { get; set; }

        // model - out of model
        public string model { get; set; }

        // date and time split - out of model
        private string date;
        private string time;

        public string Time
        {
            get { return time; }
            set { time = value; }
        }

        public string Date
        {
            get { return date; }
            set { date = value; }
        }

        public int? categoryId { get; set; }
        public string category { get; set; }

        public int? conditionId { get; set; }
        public string condition { get; set; }

        public int? brandId { get; set; }
        public string brand { get; set; }

        public Decimal? marketvalue { get; set; }
        public int? stockCount { get; set; }
    }
}

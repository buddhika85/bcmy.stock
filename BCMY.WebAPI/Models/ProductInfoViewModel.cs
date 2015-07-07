using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BCMY.WebAPI.Models
{
    // view model which models all the possible product related attributes
    public class ProductInfoViewModel
    {
        public int productlistId { get; set; }
        public string model { get; set; }
        public int quantity { get; set; }
        public string Description { get; set; }
        public int weight_grams { get; set; }
        public int volume_cm3 { get; set; }
        public string product_image { get; set; }
        public string abbr { get; set; }
        public string model_public { get; set; }
        public string description_public { get; set; }
        public Nullable<System.DateTime> dateUpdated { get; set; }
        public string status { get; set; }
        public int productbrandid { get; set; }
        public string productbrandname { get; set; }
        public decimal marketvalue { get; set; }
        public Nullable<int> actionId { get; set; }
        public string productActionName { get; set; }
        public string producttypeid { get; set; }
        public Nullable<int> productcategory { get; set; }
        public string ProductCatergoryName { get; set; }
        public Nullable<int> productcondition { get; set; }
        public string conditionName { get; set; }
        public int stockCount { get; set; }                                 // actual stock count
    }
}
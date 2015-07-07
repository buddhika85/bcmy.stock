using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess_EF.ViewModels
{
    // Models product model
    // the result of the SP_GetModelByBrandId stored procedure
    public class ProductModelViewModel
    {
        public int ProductListId { get; set; }
        public string Model { get; set; }
    }
}

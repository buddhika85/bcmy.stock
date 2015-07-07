using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess_EF.ViewModels
{
    /// <summary>
    ///  common status values for the order, orderline 
    /// </summary>
    public class Status
    {
        public int Id { get; set; }
        public string StatusStr { get; set; }
    }
}

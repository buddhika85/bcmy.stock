using DataAccess_EF.ViewModels;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BCMY.WebAPI.Util;

namespace BCMY.WebAPI.Controllers
{
    /// <summary>
    /// Returns common status values for the order, orderline stored in web.config file
    /// </summary>
    [EnableCorsAttribute("http://localhost:52448", "*", "*")]
    public class StatusController : ApiController
    {
        // GET: api/Status
        public IList<Status> Get()
        {
            try
            {
                return CommonBehaviour.GetStatusList();
            }
            catch (Exception)
            {
                return null;
            }
        }

    }
}

using BCMY.WebAPI.Models.UnityDI;
using DataAccess_EF.EntityFramework;
using DataAccess_EF.ViewModels;
using GenericRepository_UnitOfWork.GR;
using GenericRepository_UnitOfWork.UOW;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BCMY.WebAPI.Controllers
{
    [EnableCorsAttribute("http://localhost:52448", "*", "*")]
    public class SalesOrderController : ApiController
    {
        ObjectProvider objectProvider = null;
        UnitOfWork unitOfWork = null;
        GenericRepository<TblOrder> orderRepository = null;

        // constructor
        public SalesOrderController()
        {
            objectProvider = objectProvider == null ? new ObjectProvider() : objectProvider;
            unitOfWork = unitOfWork == null ? objectProvider.UnitOfWork : unitOfWork;
            orderRepository = orderRepository == null ? unitOfWork.OrderRepository : orderRepository;
        }

        // GET: api/Order
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: Get order view model by Id
        // http://localhost:61945/api/SalesOrder?orderId=1
        [HttpGet, ActionName("GetSalesOrderById")]
        public OrderViewModel GetSalesOrderById(int orderId)
        {
            try
            {
                // call stored procedure via repository
                var result = orderRepository.SQLQuery<OrderViewModel>("SP_GetOrderVmById @orderId",
                    new SqlParameter("orderId", SqlDbType.Int) { Value = orderId });
                OrderViewModel orderVm = result.FirstOrDefault<OrderViewModel>();
                return orderVm;                
            }
            catch (Exception)
            {
                return null;
            }    
        }


        // http://localhost:61945/api/SalesOrder?companyid=1&contactfulname=kumar_sangakkara
        [HttpGet, ActionName("CreateOrder")]
        public int CreateOrder(int companyId, string contactFulName)
        {
            try
            {
                // call stored procedure via repository
                var result = orderRepository.SQLQuery<int>("SP_CreateOrder @companyId, @contactFulName, @type",
                    new SqlParameter("companyId", SqlDbType.Int) { Value = companyId },
                    new SqlParameter("contactFulName", SqlDbType.Text) { Value = contactFulName },
                    new SqlParameter("type", SqlDbType.Text) { Value = "sales" });

                // convert the result to a view model object list
                int orderId = result.FirstOrDefault<int>();
                //return orderId;
                return orderId;
            }
            catch (Exception)
            {
                return -999;
            }       
        }

        // PUT: api/Order/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Order/5
        public void Delete(int id)
        {
        }

    }
}

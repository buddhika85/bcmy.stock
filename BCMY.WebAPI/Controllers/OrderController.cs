using BCMY.WebAPI.Models.UnityDI;
using BCMY.WebAPI.Util;
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
    public class OrderController : ApiController
    {
        ObjectProvider objectProvider = null;
        UnitOfWork unitOfWork = null;
        GenericRepository<TblOrder> orderRepository = null;

        // constructor
        public OrderController()
        {
            objectProvider = objectProvider == null ? new ObjectProvider() : objectProvider;
            unitOfWork = unitOfWork == null ? objectProvider.UnitOfWork : unitOfWork;
            orderRepository = orderRepository == null ? unitOfWork.OrderRepository : orderRepository;
        }

        /// <summary>
        /// Used to change the status of the order to - confirm 
        /// Returns a string message explaining the result
        /// http://localhost:61945/api/Order?orderId=25
        /// </summary>
        [HttpGet, ActionName("ConfirmOrder")]
        public string ConfirmOrder(int orderId)
        {
            try
            {               
                // call stored procedure via repository
                var result = orderRepository.SQLQuery<string>("SP_ConfirmOrder @orderId",
                    new SqlParameter("orderId", SqlDbType.Int) { Value = orderId });

                return result.FirstOrDefault<string>();            
            }
            catch (Exception ex)
            {
                return "Error - Could not access the DB Server - Please contact IT Support";
            }
        }

        /// <summary>
        /// Used to search order records
        /// 'http://localhost:61945/api/order?companyId=' + companyId + '&contactFulName=' + contactFulName +
        ///                    '&orderId=' + orderId + '&status=' + status + '&orderType=' + orderType +
        ///                    '&creationDateFrom=' + creationDateFrom + '&creationDateTo=' + creationDateTo
        ///  http://localhost:61945/api/order?companyId=1&contactFulName=kumar_sangakkara&orderId=1&status=0&orderType=0&creationDateFrom=null&creationDateTo=null
        /// </summary>
        //[HttpGet, ActionName("SearchOrders")]
        //public IEnumerable<OrderViewModel> SearchOrders(int? companyId, string contactFulName, string orderId, string status,
        //    string orderType, string creationDateFrom, string creationDateTo)
        //{
        //    // perform data formating before passing to SP
        //    DateTime? fromDate = creationDateFrom != null ? CommonBehaviour.ConvertStrToDateTime(creationDateFrom) : (DateTime?)null;
        //    DateTime? toDate = creationDateTo != null ? CommonBehaviour.ConvertStrToDateTime(creationDateTo) : (DateTime?)null;
        //    status = status != "0" ? CommonBehaviour.GetCommonStatusString(int.Parse(status)) : status;

        //    try
        //    {
        //        var result = orderRepository.SQLQuery<OrderViewModel>("SP_SearchOrders @companyId, @contactFulName, @orderId, @status, @orderType, @creationDateFrom, @creationDateTo",
        //            new SqlParameter("companyId", SqlDbType.Int) { Value = companyId == -1 ? (object)DBNull.Value : companyId },
        //            new SqlParameter("contactFulName", SqlDbType.Text) { Value = contactFulName == "-1" ? (object)DBNull.Value : contactFulName },
        //            new SqlParameter("orderId", SqlDbType.Int) { Value = orderId == null ? (object)DBNull.Value : orderId },
        //            new SqlParameter("status", SqlDbType.Text) { Value = status == "0" ? (object)DBNull.Value : status },
        //            new SqlParameter("orderType", SqlDbType.Text) { Value = orderType == "0" ? (object)DBNull.Value : orderType },
        //            new SqlParameter("creationDateFrom", SqlDbType.DateTime) { Value = creationDateFrom == null ? (object)DBNull.Value : creationDateFrom },
        //            new SqlParameter("creationDateTo", SqlDbType.DateTime) { Value = status == creationDateTo ? (object)DBNull.Value : creationDateTo });

        //        IList<OrderViewModel> orders = result.ToList<OrderViewModel>();
        //        return orders;
        //    }
        //    catch (Exception ex)
        //    {
        //        return null;
        //    }
        //}


        /// <summary>
        /// Used to search order records
        /// 'http://localhost:61945/api/order?companyId=' + companyId + '&contactFulName=' + contactFulName +
        ///                    '&orderId=' + orderId + '&status=' + status + '&orderType=' + orderType +
        ///                    '&creationDateFrom=' + creationDateFrom + '&creationDateTo=' + creationDateTo
        ///  http://localhost:61945/api/order?companyId=1&contactFulName=kumar_sangakkara&orderId=1&status=0&orderType=0&creationDateFrom=null&creationDateTo=null
        /// </summary>
        //[HttpGet, ActionName("SearchOrders")]
        [HttpGet, ActionName("SearchOrders")]
        public IEnumerable<OrderViewModel> SearchOrders(int? companyId, string contactFulName, string orderId, string status,
            string orderType, string creationDateFrom, string creationDateTo)
        {
            try
            {
                DateTime? fromDate = creationDateFrom != null ? CommonBehaviour.ConvertStrToDateTime(creationDateFrom) : (DateTime?)null;
                DateTime? toDate = creationDateTo != null ? CommonBehaviour.ConvertStrToDateTime(creationDateTo) : (DateTime?)null;
                status = status != "0" ? CommonBehaviour.GetCommonStatusString(int.Parse(status)) : null;
                orderType = orderType == "0" ? null : orderType;
                companyId = companyId == -1 ? null : companyId;
                contactFulName = contactFulName == "-1" ? null : contactFulName;

                var result = orderRepository.SQLQuery<OrderViewModel>("SP_GetAllOrderViewModels", null);
                IList<OrderViewModel> orderVms = result.ToList<OrderViewModel>();

                // filter by company
                if (companyId != null)
                    orderVms = orderVms.Where<OrderViewModel>(o => o.companyId == companyId).ToList<OrderViewModel>();

                // filter by contact full name
                if (contactFulName != null)
                {
                    contactFulName = CommonBehaviour.CleanContactFulName(contactFulName);
                    orderVms = orderVms.Where<OrderViewModel>(o => o.contactFulName == contactFulName).ToList<OrderViewModel>();
                } 

                // filter by orderId
                if (orderId != null)
                    orderVms = orderVms.Where<OrderViewModel>(o => o.id == int.Parse(orderId)).ToList<OrderViewModel>();

                // filter by status
                if (status != null)
                    orderVms = orderVms.Where<OrderViewModel>(o => o.status == status).ToList<OrderViewModel>();

                // filter by order type
                if (orderType != null)
                    orderVms = orderVms.Where<OrderViewModel>(o => o.type == orderType).ToList<OrderViewModel>();

                // filter by from date
                if (fromDate != null)
                    orderVms = orderVms.Where<OrderViewModel>(o => CommonBehaviour.ConvertStrToDateTime(o.orderCreationDate) >= fromDate).ToList<OrderViewModel>();

                // filter by to date
                if (toDate != null)
                    orderVms = orderVms.Where<OrderViewModel>(o => CommonBehaviour.ConvertStrToDateTime(o.orderCreationDate) <= toDate).ToList<OrderViewModel>();

                return orderVms;
            }
            catch (Exception ex)
            {
                
                return null;
            }
        }



    }
}

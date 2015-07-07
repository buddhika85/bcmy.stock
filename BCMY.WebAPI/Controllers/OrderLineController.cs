using BCMY.WebAPI.Models.UnityDI;
using BCMY.WebAPI.Util;
using DataAccess_EF.EntityFramework;
using GenericRepository_UnitOfWork.GR;
using GenericRepository_UnitOfWork.UOW;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Data;
using System.Data.SqlClient;
using DataAccess_EF.ViewModels;

namespace BCMY.WebAPI.Controllers
{
    [EnableCorsAttribute("http://localhost:52448", "*", "*")]
    public class OrderLineController : ApiController
    {
        ObjectProvider objectProvider = null;
        UnitOfWork unitOfWork = null;
        GenericRepository<TblOrderLine> orderLineRepository = null;

        // constructor
        public OrderLineController()
        {
            objectProvider = objectProvider == null ? new ObjectProvider() : objectProvider;
            unitOfWork = unitOfWork == null ? objectProvider.UnitOfWork : unitOfWork;
            orderLineRepository = orderLineRepository == null ? unitOfWork.OrderLineRepository : orderLineRepository;
        }

        /// <summary>
        /// Used to save a negotiation record
        /// </summary>
        /// http://localhost:61945/api/Orderline?productListId=107233&quantityVal=3&pricePerItem=5.0&totalAmountVal=15.0&statusVal=2&orderIdVal=47
        [HttpGet, ActionName("SaveOrderlineWithNegotiation")]
        public IList<OrderLineViewModel> SaveOrderlineWithNegotiation(int productListId, decimal quantityVal, decimal pricePerItem, decimal totalAmountVal, int statusVal, int orderIdVal)
        {            
            try
            {
                // validation 
                if (OrderLineNegotiationValidator.ValidateOrderLineOrNegotiation(productListId, quantityVal, pricePerItem, totalAmountVal, statusVal, orderIdVal))
                {
                    string status = CommonBehaviour.GetCommonStatusString(statusVal);
                    // call stored procedure via repository
                    var result = orderLineRepository.SQLQuery<OrderLineViewModel>("SP_SaveOrderLineWithNegotiation @productListId, @quantityVal, @pricePerItem, @totalAmountVal, @status, @dateTime, @orderIdVal",
                        new SqlParameter("productListId", SqlDbType.Int) { Value = productListId },
                        new SqlParameter("quantityVal", SqlDbType.Int) { Value = quantityVal }, 
                        new SqlParameter("pricePerItem", SqlDbType.Decimal) { Value = pricePerItem },
                        new SqlParameter("totalAmountVal", SqlDbType.Decimal) { Value = totalAmountVal },
                        new SqlParameter("status", SqlDbType.Text) { Value = status },
                        new SqlParameter("dateTime", SqlDbType.DateTime) { Value = DateTime.Now },
                        new SqlParameter("orderIdVal", SqlDbType.Int) { Value = orderIdVal });

                    // convert the result orderlines (by order ID)
                    IList<OrderLineViewModel> orderLinesOfOrder = result.ToList<OrderLineViewModel>();
                    orderLinesOfOrder = FixDateTime(orderLinesOfOrder);
                    return orderLinesOfOrder;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Gets all the orderlines of an order by an orderId
        /// </summary>
        /// http://localhost:61945/api/Orderline?orderIdVal=47
        [HttpGet, ActionName("GetAllOrderlinesByOrderId")]
        public IList<OrderLineViewModel> GetAllOrderlinesByOrderId(int orderIdVal)
        {
            try
            { 
                // call stored procedure via repository
                var result = orderLineRepository.SQLQuery<OrderLineViewModel>("SP_GetOrderLinesByOrderId @orderIdVal",                       
                    new SqlParameter("orderIdVal", SqlDbType.Int) { Value = orderIdVal });

                // convert the result orderlines (by order ID)
                IList<OrderLineViewModel> orderLinesOfOrder = result.ToList<OrderLineViewModel>();
                orderLinesOfOrder = FixDateTime(orderLinesOfOrder);
                return orderLinesOfOrder;
            }
            catch (Exception ex)
            {
                return null;
            }
        } 


        /// <summary>
        /// Get orderline info by orderline Id
        /// </summary>
        /// http://localhost:61945/api/Orderline?orderlineId=1
        [HttpGet, ActionName("GetOrderLineInfoByOrderlineId")]
        public OrderLineViewModel GetOrderLineInfoByOrderlineId(int orderlineId)
        {
            try
            {
                
                // call stored procedure via repository
                var result = orderLineRepository.SQLQuery<OrderLineViewModel>("SP_GetOrderlineInfoById @orderlineId",
                    new SqlParameter("orderlineId", SqlDbType.Int) { Value = orderlineId });

                // convert the result to orderline
                OrderLineViewModel olVm = result.FirstOrDefault<OrderLineViewModel>();
                return olVm;                
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        /// <summary>
        /// Fixes date and time null issue
        /// </summary>
        private IList<OrderLineViewModel> FixDateTime(IList<OrderLineViewModel> orderLinesOfOrder)
        {
            foreach (OrderLineViewModel ol in orderLinesOfOrder)
            {
                ol.Date = ol.orderlineDateTime.Date.ToShortDateString();
                ol.Time = ol.orderlineDateTime.ToString("hh:mm tt");
            }
            return orderLinesOfOrder;
        }

    }
}

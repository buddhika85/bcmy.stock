using DataAccess_EF.EntityFramework;
using DataAccess_EF.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BCMY.WebAPI.Util
{
    /// <summary>
    /// used to perform view model converstions
    /// </summary>
    public static class ViewModelConvertor
    {
        public static NegotiationViewModel ConvertToVm(TblNegotiation model) 
        {
            NegotiationViewModel vm = new NegotiationViewModel() { 
                id = model.id,
                productId = model.productId, 
                quantity = model.quantity,
                negotiatedPricePerItem = model.negotiatedPricePerItem,
                date = model.negotiationDateTime.Date.ToShortDateString(),
                time = model.negotiationDateTime.ToString("hh:mm tt"),
                totalAmount = model.totalAmount,
                status = model.status,
                negotiationDateTime = model.negotiationDateTime,
                orderId = model.orderId
            };
            return vm;
        }
    }
}
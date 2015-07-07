using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BCMY.WebAPI.Util
{
    public static class OrderLineNegotiationValidator
    {
        /// <summary>
        /// Validates negotiations or orderline records related fields
        /// </summary>
        public static bool ValidateOrderLineOrNegotiation(int productListId, decimal quantityVal, decimal pricePerItem, decimal totalAmountVal, int status, int orderIdVal)
        {
            bool isValid = false;
            try
            {
                isValid = GeneralValidator.IsNumeric(productListId) &&
                    GeneralValidator.IsDecimalNumber(quantityVal) &&
                    GeneralValidator.IsDecimalNumber(pricePerItem) &&
                    GeneralValidator.IsDecimalNumber(totalAmountVal) &&
                    GeneralValidator.IsNumeric(status) &&
                    GeneralValidator.IsNumeric(orderIdVal);
            }
            catch (Exception)
            {
                return isValid;
            }
            return isValid;
        }
    }
}
using BCMY.WebAPI.Models.UnityDI;
using DataAccess_EF.EntityFramework;
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
using System.Web.Script.Serialization;

namespace BCMY.WebAPI.Controllers
{
    [EnableCorsAttribute("http://localhost:52448", "*", "*")]
    public class CustomerSupplierController : ApiController
    {
        ObjectProvider objectProvider = null;
        UnitOfWork unitOfWork = null;
        GenericRepository<TblCustomerSupplier> customerSupplierRepository = null;

        // constructor
        public CustomerSupplierController()
        {
            objectProvider = objectProvider == null ? new ObjectProvider() : objectProvider;
            unitOfWork = unitOfWork == null ? objectProvider.UnitOfWork : unitOfWork;
            customerSupplierRepository = customerSupplierRepository == null ? unitOfWork.CustomerSupplierRepository : customerSupplierRepository;
        }

        // GET: api/CustomerSupplier
        public IEnumerable<TblCustomerSupplier> Get()
        {
            try
            {
                return customerSupplierRepository.GetAll();                
            }
            catch (Exception)
            {
                return null;
            }            
        }

        // GET: api/CustomerSupplier/5
        public TblCustomerSupplier Get(int id)
        {
            try
            {
                return customerSupplierRepository.GetByPrimaryKey(id);
            }
            catch (Exception)
            {
                return null;
            }           
        }

        // POST: api/CustomerSupplier
        //public void Post([FromBody]string passedString)
        //public string Post([FromBody] string customerSupplierJson)
        //{
        //    string message = string.Empty;
        //    try
        //    {                
        //        // convert json string to object
        //        TblCustomerSupplier customerSupplier = new JavaScriptSerializer().Deserialize<TblCustomerSupplier>(customerSupplierJson);
        //        // validation 
        //        if (ValidateCustomerSupplier(customerSupplier))
        //        {
        //            customerSupplier.logo = customerSupplier.logo == string.Empty ? null : customerSupplier.logo;
        //            customerSupplier.creationDateTime = DateTime.Now;
        //            customerSupplierRepository.Insert(customerSupplier);
        //            unitOfWork.Save();
        //            message = "success";
        //        }
        //        else
        //        {
        //            message = "Error - Please fill all the mandatory fields";
        //        }                
        //    }
        //    catch (Exception)
        //    {
        //        message = "Error - Server side Json Serialisation error. Please contact IT Support";
        //    }
        //    return message;
        //}

        // used to save - insert/update
        [HttpGet, ActionName("Save")]       
        public string Save(int idVal, string name, string logo, string addressLine1, string addressLine2, string addressLine3, string postcode, string country, string telephone,
            string bank, string vatNumber, string accountNumber, string sortCode, string iban, string swift, bool active, string town, string county)
        {
            string message = string.Empty;
            try
            {
                TblCustomerSupplier customerSupplier = GetCustomerSuppliers(idVal, name, logo, addressLine1, addressLine2, addressLine3, postcode, country, telephone, bank, vatNumber, accountNumber, sortCode, iban, swift, active, town, county);
                // validation 
                if (ValidateCustomerSupplier(customerSupplier))
                {                    
                    // insert
                    if (customerSupplier.id == -1)
                    {
                        customerSupplierRepository.Insert(customerSupplier);
                    }
                    else // update
                    {
                        customerSupplierRepository.Update(customerSupplier);
                    }
                    
                    unitOfWork.Save();
                    message = "success";
                }
                else
                {
                    message = "Error - Please fill all the mandatory fields";
                }
            }
            catch (Exception ex)
            {
                message = "Error - Server side Json Serialisation error. Please contact IT Support";
            }
            return message;
        }

        
        // PUT: api/CustomerSupplier/5
        //public string Put([FromBody]string updatedCustomerSupplier)
        //{
        //    string message = string.Empty;
        //    try
        //    {
        //        // convert json string to object
        //        TblCustomerSupplier customerSupplier = new JavaScriptSerializer().Deserialize<TblCustomerSupplier>(updatedCustomerSupplier);
        //        // validation 
        //        if (ValidateCustomerSupplier(customerSupplier))
        //        {
        //            customerSupplier.logo = customerSupplier.logo == string.Empty ? null : customerSupplier.logo;
        //            customerSupplierRepository.Update(customerSupplier);
        //            unitOfWork.Save();
        //            message = "success";
        //        }
        //        else
        //        {
        //            message = "Error - Please fill all the mandatory fields";
        //        }
        //    }
        //    catch (Exception)
        //    {
        //        message = "Error - Server side Json Serialisation error. Please contact IT Support";
        //    }
        //    return message;
        //}
        
        // DELETE: api/CustomerSupplier/5
        public void Delete(int id)
        {
        }

        /// Returns TblCustomerSupplier list based on contacts full name
        /// ful name = firstName + _ + lastname
        [HttpGet, ActionName("GetCustomerSuppliersByContactFulName")]
        public IEnumerable<TblCustomerSupplier> GetCustomerSuppliersByContactFulName(string contactFulName)
        {
            try
            {
                // call stored procedure via repository
                var result = customerSupplierRepository.SQLQuery<TblCustomerSupplier>("SP_GetCustomerSuppliersByFullName @fullName",
                    new SqlParameter("fullName", SqlDbType.VarChar) { Value = contactFulName });
                // convert the result to a view model object list
                IEnumerable<TblCustomerSupplier> customerSuppliersByFulName = result.ToList<TblCustomerSupplier>();
                return customerSuppliersByFulName;
            }
            catch (Exception)
            {
                return null;
            }
        }

        #region HELPER METHODS
        /// <summary>
        /// Validates user inputs
        /// </summary>        
        private bool ValidateCustomerSupplier(TblCustomerSupplier customerSupplier)
        {
            bool isValid = true;

            // write validation logic

            return isValid;
        }

        /// <summary>
        /// Creates a customer supplier obj by passed params
        /// </summary>
        private TblCustomerSupplier GetCustomerSuppliers(int idVal, string name, string logo, string addressLine1, string addressLine2, string addressLine3, string postcode, string country, string telephone, string bank, string vatNumber, string accountNumber, string sortCode, string iban, string swift, bool active, string county, string town)
        {
            try
            {
                return new TblCustomerSupplier() { 
                     id = idVal,
                     name = name,
                     logo = null,
                     addressLine1 = addressLine1,
                     addressLine2 = addressLine2,
                     addressLine3 = addressLine3,
                     postcode = postcode,
                     country = country,
                     telephone = telephone,
                     bank = bank,
                     vatNumber = vatNumber,
                     accountNumber = accountNumber,
                     sortcode = sortCode,
                     iban = iban,
                     swift = swift,
                     creationDateTime = DateTime.Now,
                     inactiveDateTime = null,
                     active = active,
                     county = county,
                     town = town
                };

            }
            catch (Exception)
            {
                return null;
            }
        }


        /// <summary>
        /// Used to set the creation date of the record properly based on DB initial data
        /// </summary>
        //private TblCustomerSupplier SetCreationDate(TblCustomerSupplier customerSupplier)
        //{
        //    TblCustomerSupplier original = customerSupplierRepository.GetByPrimaryKey(customerSupplier.id);
        //    customerSupplier.creationDateTime = original.creationDateTime;
        //    return customerSupplier;
        //}
        #endregion HELPER METHODS
    }
}

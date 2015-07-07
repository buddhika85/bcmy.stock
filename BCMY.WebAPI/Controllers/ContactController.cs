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
using System.Web.Script.Serialization;

namespace BCMY.WebAPI.Controllers
{
    [EnableCorsAttribute("http://localhost:52448", "*", "*")]
    public class ContactController : ApiController
    {
        ObjectProvider objectProvider = null;
        UnitOfWork unitOfWork = null;
        GenericRepository<TblContact> contactRepository = null;

        // constructor
        public ContactController()
        {
            objectProvider = objectProvider == null ? new ObjectProvider() : objectProvider;
            unitOfWork = unitOfWork == null ? objectProvider.UnitOfWork : unitOfWork;
            contactRepository = contactRepository == null ? unitOfWork.ContactRepository : contactRepository;
        }

        // GET: api/Contact
        public IEnumerable<ContactsViewModel> Get()
        {
            try
            {                
                var result = contactRepository.SQLQuery<ContactsViewModel>("SP_GetContactsWithCompanyNames", null);     // call stored procedure via repository 
                IList<ContactsViewModel> contactViewModels = result.ToList<ContactsViewModel>();                        // convert the result to a view model object list
                return contactViewModels;
            }
            catch (Exception)
            {
                return null;
            }            
        }

        // GET: api/Contact/5
        public ContactsViewModel Get(int id)
        {
            try
            {
                // call stored procedure via repository
                var result = contactRepository.SQLQuery<ContactsViewModel>("SP_GetContactInfo @contactId", new SqlParameter("contactId", SqlDbType.Int) { Value = id });
                // convert the result to a view model object list
                ContactsViewModel contactViewModel = result.SingleOrDefault<ContactsViewModel>();
                return contactViewModel;
            }
            catch (Exception)
            {
                return null;
            }            
        }

        /// <summary>
        /// For insert or update
        /// </summary>       
        [HttpGet, ActionName("Save")]     
        public string Save(int id, string title, string firstName, string lastName, string position, string directDial, string email, string status, string notes, int customerSupplierId, int? extension)
        {
            string message = string.Empty;
            try
            {
                // convert json string to object
                TblContact contact = GetContact(id, title, firstName, lastName, position, directDial, email, status, notes, customerSupplierId, extension);
                // validation 
                if (ValidateContact(contact))
                {
                    // insert
                    if (contact.id == -1)
                    {
                        contactRepository.Insert(contact);
                    }
                    else // update
                    {
                        contactRepository.Update(contact);
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
                

        // POST: api/Contact
        //public string Post([FromBody]string contactJsonStr)
        //{
        //    string message = string.Empty;
        //    try
        //    {
        //        // convert json string to object
        //        TblContact contact = new JavaScriptSerializer().Deserialize<TblContact>(contactJsonStr);
        //        // validation 
        //        if (ValidateContact(contact))
        //        {                    
        //            contactRepository.Insert(contact);
        //            unitOfWork.Save();
        //            message = "success";
        //        }
        //        else
        //        {
        //            message = "Error - Please fill all the mandatory fields";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        message = "Error - Server side Json Serialisation error. Please contact IT Support";
        //    }
        //    return message;
        //}

        // PUT: api/Contact/5
        //public string Put([FromBody]string contactJsonStr)
        //{
        //    string message = string.Empty;
        //    try
        //    {
        //        // convert json string to object
        //        TblContact contact = new JavaScriptSerializer().Deserialize<TblContact>(contactJsonStr);
        //        // validation 
        //        if (ValidateContact(contact))
        //        {
        //            contactRepository.Update(contact);
        //            unitOfWork.Save();
        //            message = "success";
        //        }
        //        else
        //        {
        //            message = "Error - Please fill all the mandatory fields";
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        message = "Error - Server side Json Serialisation error. Please contact IT Support";
        //    }
        //    return message;
        //}

        // DELETE: api/Contact/5
        public void Delete(int id)
        {
        }

        // Returns TblContact list based on customerSupplierId
        [HttpGet, ActionName("GetContactsByCustomerSupplierId")]
        public IEnumerable<TblContact> GetContactsByCustomerSupplierId(string customerSupplierId)
        {
            try
            {
                // call stored procedure via repository
                var result = contactRepository.SQLQuery<TblContact>("SP_GetContactsByCustomerSupplierId @customerSupplierId", 
                    new SqlParameter("customerSupplierId", SqlDbType.Int) { Value = customerSupplierId });
                // convert the result to a view model object list
                IEnumerable<TblContact> contactsByCust = result.ToList<TblContact>();
                return contactsByCust;
            }
            catch (Exception)
            {
                return null;
            }       
        }

        /// <summary>
        /// Validates user inputs
        /// </summary>
        private bool ValidateContact(TblContact contact)
        {
            bool isValid = false;

            // string emptiness validation
            isValid = GeneralValidator.IsStringNotEmpty(contact.title) &&
                GeneralValidator.IsStringNotEmpty(contact.firstName) &&
                GeneralValidator.IsStringNotEmpty(contact.lastName) &&
                GeneralValidator.IsStringNotEmpty(contact.position) &&
                GeneralValidator.IsStringNotEmpty(contact.directDial) &&
                GeneralValidator.IsStringNotEmpty(contact.email) &&
                GeneralValidator.IsStringNotEmpty(contact.status) &&
                GeneralValidator.IsOneOfStringList(contact.title, new List<string>() { "Mr", "Ms", "Mrs", "Miss", "Dr" }) &&
                GeneralValidator.IsOneOfStringList(contact.status, new List<string>() { "active", "inactive" }) &&
                GeneralValidator.IsValidEmailAddress(contact.email);
            
            return isValid;
        }

        /// <summary>
        /// Returns a conact obj by using passed params
        /// </summary>
        private TblContact GetContact(int id, string title, string firstName, string lastName, string position, string directDial, string email, string status, string notes, int customerSupplierId, int? extension)
        {
            try
            {
                return new TblContact() { 
                    id = id,
                    title = title,
                    firstName = firstName,
                    lastName = lastName,
                    position = position,
                    directDial = directDial,
                    email = email,
                    status = status,
                    notes = notes,
                    customerSupplierId = customerSupplierId,
                    extension = extension
                };
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}

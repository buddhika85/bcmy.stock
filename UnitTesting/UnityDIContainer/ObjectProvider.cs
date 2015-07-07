using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using DataAccess_EF.EntityFramework;
using GenericRepository_UnitOfWork.UOW;
using GenericRepository_UnitOfWork.GR;

namespace UnitTesting.UnityDIContainer
{
    class ObjectProvider
    {
        // Unity DI container
        UnityContainer unityContainer = new UnityContainer();

        // set of private instances
        #region INSTANCES
        // unit of work and generic repository instances
        private UnitOfWork unitOfWork;
        private UnitOfWorkBcmyExternalDatabase unitOfWorkBcmyExternal;        
        private GenericRepository<TblCustomerSupplier> customerSupplierRepository;

        // entities from the DB 
        private TblCustomerSupplier customerSupplier;
        private TblContact contact;        
        #endregion INSTANCES

        // collection of public properties
        #region PROPERTIES
        // for the current [BCMY_Stock] databse
        public UnitOfWork UnitOfWork
        {
            get 
            { 
                if (unitOfWork == null)
                {
                    unitOfWork = unityContainer.Resolve<UnitOfWork>();
                }
                return unitOfWork; 
            }            
        }
        // for the external [BCMY] database - mainly used to get the product information
        public UnitOfWorkBcmyExternalDatabase UnitOfWorkBcmyExternal
        {
            get 
            {
                if (unitOfWorkBcmyExternal == null)
                {
                    unitOfWorkBcmyExternal = unityContainer.Resolve<UnitOfWorkBcmyExternalDatabase>();
                }
                return unitOfWorkBcmyExternal; 
            }
        }
        public GenericRepository<TblCustomerSupplier> CustomerSupplierRepository
        {
            get
            {
                if (customerSupplierRepository == null)
                {
                    customerSupplierRepository = unityContainer.Resolve<GenericRepository<TblCustomerSupplier>>();
                }
                return customerSupplierRepository;
            }             
        }
        public TblCustomerSupplier CustomerSupplier
        {
            get 
            {
                if (customerSupplier == null)
                {
                    customerSupplier = unityContainer.Resolve<TblCustomerSupplier>();
                }
                return customerSupplier;
            }
        }
        public TblContact Contact
        {
            get 
            {
                if (contact == null)
                {
                    contact = unityContainer.Resolve<TblContact>();
                }
                return contact;
            }            
        }
        #endregion PROPERTIES

    }
}

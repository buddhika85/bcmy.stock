using DataAccess_EF.EntityFramework;
using GenericRepository_UnitOfWork.GR;
using GenericRepository_UnitOfWork.UOW;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BCMY.WebAPI.Models.UnityDI
{
    public class ObjectProvider
    {
        // Unity DI container
        UnityContainer unityContainer = new UnityContainer();

        // set of private instances
        #region INSTANCES
        private UnitOfWork unitOfWork;
        private UnitOfWorkBcmyExternalDatabase unitOfWorkBcmyExternal; 
        private TblCustomerSupplier customerSupplier;
        #endregion INSTANCES

        // collection of public properties
        #region PROPERTIES
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
        #endregion PROPERTIES
    }
}
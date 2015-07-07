using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using UnitTesting.UnityDIContainer;
using GenericRepository_UnitOfWork.UOW;
using GenericRepository_UnitOfWork.GR;
using DataAccess_EF.EntityFramework;
using System.Collections.Generic;
using System.Linq;

namespace UnitTesting.RepositoryCRUDTesting
{
    // tests DB view in the external [BCMY] database
    [TestClass]
    public class ExternalProductsTesting
    {
        // objects that can be reused with in the unit test class
        ObjectProvider objectProvider = null;
        UnitOfWorkBcmyExternalDatabase unitOfWorkExt = null;
        GenericRepository<vProductInfo> productInfoViewRepository = null;

        /// <summary>
        /// constructor 
        /// </summary>
        public ExternalProductsTesting()
        {
            objectProvider = new ObjectProvider();
            unitOfWorkExt = objectProvider.UnitOfWorkBcmyExternal;
            productInfoViewRepository = unitOfWorkExt.ProductInfoViewRepository;
        }

        [TestMethod]
        public void TestDbView_vProductInfo()
        {
            try
            {
                IList<vProductInfo> allRecords = productInfoViewRepository.GetAll().ToList<vProductInfo>();

                if (allRecords.Any() == false)
                {
                    Assert.Fail("Product Info - No contact product info records retreived from the BCMY external DB");
                }
            }
            catch (Exception)
            {
                Assert.Fail("Product Info - Get all product info records failed");
                return;
            }
        }
    }
}

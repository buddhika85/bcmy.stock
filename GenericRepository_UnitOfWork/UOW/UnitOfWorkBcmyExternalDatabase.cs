using DataAccess_EF.EntityFramework;
using GenericRepository_UnitOfWork.GR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GenericRepository_UnitOfWork.UOW
{
    // Allows transaction handling - in the external database - [BCMY]
    // Mainly allows connected classes/entities to be committed as a single transaction
    public class UnitOfWorkBcmyExternalDatabase
    {
        #region PROPERTIES
        private BCMYEntities _context = new BCMYEntities();       
        #endregion PROPERTIES

        #region REPOSITORIES

        // all the table/entity specific repositories as instances
        private GenericRepository<vProductInfo> productInfoViewRepository;
        private GenericRepository<productCondition> productConditionRepository;        
        private GenericRepository<productbrand> productBrandRepository;
        private GenericRepository<ProductCategory> productCategoryRepository;
        

        // add more repositories below
        // ...
        // ..

        // properties to return table/entity specific repository instances
        public GenericRepository<vProductInfo> ProductInfoViewRepository
        {
            get
            {
                if (productInfoViewRepository == null)
                {
                    productInfoViewRepository = new GenericRepository<vProductInfo>(_context);
                }
                return productInfoViewRepository;
            }
        }
        public GenericRepository<productCondition> ProductConditionRepository
        {
            get 
            {
                if (productConditionRepository == null)
                {
                    productConditionRepository = new GenericRepository<productCondition>(_context);
                }
                return productConditionRepository; 
            }            
        }
        public GenericRepository<productbrand> ProductBrandRepository
        {
            get 
            {
                if (productBrandRepository == null)
                {
                    productBrandRepository = new GenericRepository<productbrand>(_context);
                }
                return productBrandRepository; 
            }            
        }
        public GenericRepository<ProductCategory> ProductCategoryRepository
        {
            get 
            {
                if (productCategoryRepository == null)
                {
                    productCategoryRepository = new GenericRepository<ProductCategory>(_context);
                }
                return productCategoryRepository; 
            }            
        }
        #endregion REPOSITORIES
    }
}

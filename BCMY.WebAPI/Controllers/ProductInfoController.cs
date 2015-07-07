using BCMY.WebAPI.Models;
using BCMY.WebAPI.Models.UnityDI;
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
    /// <summary>
    /// This controller deals with product informationrelated data retrieval from [BCMY] external database
    /// </summary>
    [EnableCorsAttribute("http://localhost:52448", "*", "*")]
    public class ProductInfoController : ApiController
    {
        ObjectProvider objectProvider = null;
        UnitOfWorkBcmyExternalDatabase unitOfWorkExt = null;
        GenericRepository<vProductInfo> productInfoViewRepository = null;
        GenericRepository<productCondition> productConditionRepository = null;
        GenericRepository<productbrand> productBrandRepository = null;
        GenericRepository<ProductCategory> productCategoryRepository = null;
        

        // constructor
        public ProductInfoController()
        {
            objectProvider = objectProvider == null ? new ObjectProvider() : objectProvider;
            unitOfWorkExt = unitOfWorkExt == null ? objectProvider.UnitOfWorkBcmyExternal : unitOfWorkExt;

            productInfoViewRepository = productInfoViewRepository == null ? unitOfWorkExt.ProductInfoViewRepository : productInfoViewRepository;
            productConditionRepository = productConditionRepository == null ? unitOfWorkExt.ProductConditionRepository : productConditionRepository;
            productBrandRepository = productBrandRepository == null ? unitOfWorkExt.ProductBrandRepository : productBrandRepository;
            productCategoryRepository = productCategoryRepository == null ? unitOfWorkExt.ProductCategoryRepository : productCategoryRepository;
        }

        // GET: api/ProductInfo
        // queries vProductInfo database view
        public IEnumerable<vProductInfo> Get()
        {
            try
            {
                return productInfoViewRepository.GetAll();
            }
            catch (Exception)
            {
                return null;
            }     
        }


        // Returns all the product conditions
        // http://localhost:61945/api/productinfo/getconditions?getconditions=true
        [HttpGet, ActionName("GetProductConditions")]
        public IEnumerable<productCondition> GetProductConditions(string getConditions)
        {
            try
            {
                IList<productCondition> productConditions = productConditionRepository.GetAll().ToList<productCondition>();
                return productConditions;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // Returns all the product brands
        // http://localhost:61945/api/productinfo/getbrands?getbrands=true
        [HttpGet, ActionName("GetProductBrands")]
        public IEnumerable<ProductBrandViewModel> GetProductBrands(string getBrands)
        {
            try
            {
                IList<productbrand> productBrands = productBrandRepository.GetAll().ToList<productbrand>();
                IList<ProductBrandViewModel> vms = new List<ProductBrandViewModel>();
                foreach (productbrand item in productBrands)
                {
                    ProductBrandViewModel vm = new ProductBrandViewModel();
                    vm.productbrandid = item.productbrandid;
                    vm.productbrandname = item.productbrandname;
                    vms.Add(vm);
                }
                return vms;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // Returns all the product categories
        // http://localhost:61945/api/productinfo/getcategories?getcategories=true
        [HttpGet, ActionName("GetProductCategories")]
        public IEnumerable<ProductCategory> GetProductCategories(string getCategories)
        {
            try
            {
                IList<ProductCategory> productCategories = productCategoryRepository.GetAll().ToList<ProductCategory>();
                return productCategories;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // Returns all the distinct product model names
        // http://localhost:61945/api/productinfo/getmodels?getmodels=true
        [HttpGet, ActionName("GetDistinctProductModels")]
        public IEnumerable<string> GetDistinctProductModels(string getModels)
        {
            try
            {
                // call stored procedure via repository
                var result = productInfoViewRepository.SQLQuery<string>("SP_GetDistinctProductModels", null);
                // convert the result to a view model object list
                IEnumerable<string> modelList = result.ToList<string>();
                return modelList;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // Returns all conditions by category Id
        // http://localhost:61945/api/productinfo/categoryId?categoryId=1
        [HttpGet, ActionName("GetConditionsByCategory")]
        public IEnumerable<productCondition> GetConditionsByCategory(int categoryId)
        {
            try
            {
                // call stored procedure via repository
                var result = productConditionRepository.SQLQuery<productCondition>("SP_GetConditionsByCategoryId @categoryId",
                    new SqlParameter("categoryId", SqlDbType.Int) { Value = categoryId });
                // convert the result to a view model object list
                IEnumerable<productCondition> conditionsByCategory = result.ToList<productCondition>();
                return conditionsByCategory;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // Returns all conditions by condition Id
        // http://localhost:61945/api/ProductInfo?categoryId=1&conditionId=2
        [HttpGet, ActionName("GetBrandByCondition")]
        public IEnumerable<productbrand> GetBrandByCondition(int categoryId, int conditionId)
        {
            try
            {
                // call stored procedure via repository
                var result = productConditionRepository.SQLQuery<productbrand>("SP_GetBrandsByConditionId @categoryId, @conditionId",
                    new SqlParameter("categoryId", SqlDbType.Int) { Value = categoryId },
                    new SqlParameter("conditionId", SqlDbType.Int) { Value = conditionId });
                // convert the result to a view model object list
                IEnumerable<productbrand> brandsByCondition = result.ToList<productbrand>();
                return brandsByCondition;
            }
            catch (Exception)
            {
                return null;
            }
        }

        // Returns all conditions by condition Id
        // http://localhost:61945/api/ProductInfo?categoryId=1&conditionId=2&brandIdsCommaDelimited={brandIdsCommaDelimited}
        [HttpGet, ActionName("GetModelsByBrand")]
        public IEnumerable<ProductModelViewModel> GetModelsByBrand(int categoryId, int conditionId, string brandIdsCommaDelimited)
        {
            try
            {
                // call stored procedure via repository
                var result = productConditionRepository.SQLQuery<ProductModelViewModel>("SP_GetModelByBrandId @categoryId, @conditionId, @brandIdsCommaDelimited",
                    new SqlParameter("categoryId", SqlDbType.Int) { Value = categoryId },
                    new SqlParameter("conditionId", SqlDbType.Int) { Value = conditionId },
                    new SqlParameter("brandIdsCommaDelimited", SqlDbType.Text) { Value = brandIdsCommaDelimited });
                // convert the result to a view model object list
                IEnumerable<ProductModelViewModel> modelsByBrand = result.ToList<ProductModelViewModel>();
                return modelsByBrand;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        // Returns all conditions by condition Id
        // http://localhost:61945/api/productinfo/
        [HttpGet, ActionName("SearchProducts")]
        public IEnumerable<ProductInfoViewModel> SearchProducts(int categoryId, int? conditionId, string brandIds, string modelIds)
        {            
            try
            {
                // call stored procedure via repository
                var result = productInfoViewRepository.SQLQuery<ProductInfoViewModel>("SP_SearchProducts @categoryId, @conditionId, @brandIds, @modelIds",
                    new SqlParameter("categoryId", SqlDbType.Int) { Value = categoryId },
                    new SqlParameter("conditionId", SqlDbType.Int) { Value = conditionId == -1 ? (object)DBNull.Value : conditionId },
                    new SqlParameter("brandIds", SqlDbType.Text) { Value = brandIds == "-1" ? (object)DBNull.Value : brandIds },
                    new SqlParameter("modelIds", SqlDbType.Text) { Value = modelIds == "-1" ? (object)DBNull.Value : modelIds });

                // convert the result to a view model object list
                IEnumerable<ProductInfoViewModel> searchedProducts = result.ToList<ProductInfoViewModel>();
                return searchedProducts;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        // Returns all conditions by condition Id
        // http://localhost:61945/api/ProductInfo?productlistId=100003
        [HttpGet, ActionName("SearchProducts")]
        public ProductInfoViewModel GetProductInfoVmById(int productlistId)
        {
            try
            {
                // call stored procedure via repository
                var result = productConditionRepository.SQLQuery<ProductInfoViewModel>("SP_GetProductInfoById @productlistId",
                    new SqlParameter("productlistId", SqlDbType.Int) { Value = productlistId });
                // convert the result to a view model object
                ProductInfoViewModel productInfoVm = result.FirstOrDefault<ProductInfoViewModel>();
                return productInfoVm;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}

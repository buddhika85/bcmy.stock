using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using GenericRepository_UnitOfWork.UOW;
using UnitTesting.UnityDIContainer;
using GenericRepository_UnitOfWork.GR;
using DataAccess_EF.EntityFramework;
using System.Linq;
using System.Collections.Generic;

namespace UnitTesting.RepositoryCRUDTesting
{
    [TestClass]
    public class CustomerSupplierTesting
    {
        // objects that can be reused with in the unit test class
        ObjectProvider objectProvider = null;
        UnitOfWork unitOfWork = null;
        GenericRepository<TblCustomerSupplier> customerSupplierRepository = null;

        /// <summary>
        /// constructor 
        /// </summary>
        public CustomerSupplierTesting()
        {
            objectProvider = new ObjectProvider();
            unitOfWork = objectProvider.UnitOfWork;
            customerSupplierRepository = unitOfWork.CustomerSupplierRepository;
        }

        [TestMethod]
        public void TestInsertCustSupplier()
        {
            // arrange            
            int actualCount = customerSupplierRepository.GetAll().Count();
            int expectedCount = ++actualCount;
            TblCustomerSupplier customerSupplier = objectProvider.CustomerSupplier;
            customerSupplier.name = "Test Customer";
            customerSupplier.logo = null;
            customerSupplier.addressLine1 = "241";
            customerSupplier.addressLine2 = "New Church Road";
            customerSupplier.addressLine3 = "Hove";
            customerSupplier.postcode = "BN3 4EE";
            customerSupplier.country = "UK";
            customerSupplier.telephone = "01234567890";
            customerSupplier.bank = "Santander";
            customerSupplier.vatNumber = "Test VAT 1";
            customerSupplier.accountNumber = "0987654321";
            customerSupplier.sortcode = "11-11-11";
            customerSupplier.iban = "Test IBAN";
            customerSupplier.swift = "Test SWIFT";
            customerSupplier.creationDateTime = DateTime.Now;
            customerSupplier.inactiveDateTime = null;
            customerSupplier.active = true;

            // act
            try
            {
                customerSupplierRepository.Insert(customerSupplier);
                unitOfWork.Save();
                actualCount = customerSupplierRepository.GetAll().Count();
            }
            catch (Exception)
            {
                // assert
                Assert.Fail("Business - Insertion Failed");
                return;
            }

            // assert
            Assert.AreEqual(expectedCount, actualCount, "Business - Excpected and actual record counts after insertion do not match");
        }

        
        [TestMethod]
        public void TestUpdateCustSupplier()
        {            
            try
            {
                // arrange
                IList<TblCustomerSupplier> allRecords = customerSupplierRepository.GetAll().ToList<TblCustomerSupplier>();
                int lastId = allRecords.Max(b => b.id);
                TblCustomerSupplier lastRecord = allRecords.Where(b => b.id == lastId).SingleOrDefault<TblCustomerSupplier>();
                Assert.IsNotNull(lastRecord, "Customer/Supplier - Last Customer/Supplier record was not retrieved");

                // act
                if (lastRecord != null)
                {
                    lastRecord.name = "Updated - Test Customer/Supplier";
                    customerSupplierRepository.Update(lastRecord);
                    unitOfWork.Save();
                }
            }
            catch (Exception)
            {
                // assert
                Assert.Fail("Customer/Supplier - Update failed");
                return;
            }
        }

        // delete
        [TestMethod]
        public void TestDeleteCustSupplier()
        {           
            // act
            try
            {
                IList<TblCustomerSupplier> allRecords = customerSupplierRepository.GetAll().ToList<TblCustomerSupplier>();
                int lastId = allRecords.Max(b => b.id);
                int countBeforeDel = allRecords.Count();
                customerSupplierRepository.Delete(lastId);
                unitOfWork.Save();
                int expectedCount = --countBeforeDel;
                int actualCount = customerSupplierRepository.GetAll().ToList<TblCustomerSupplier>().Count();
                Assert.AreEqual(expectedCount, actualCount, "Customer/Supplier - After the deletion expected and actual record counts do not match");
            }
            catch (Exception)
            {
                Assert.Fail("Customer/Supplier - Delete failed");
                return;
            }        
        }

        // make inactive
        [TestMethod]
        public void TestMakeInactiveCustSupplier()
        {
            try
            {
                // arrange
                IList<TblCustomerSupplier> allRecords = customerSupplierRepository.GetAll().ToList<TblCustomerSupplier>();
                int lastId = allRecords.Max(b => b.id);
                TblCustomerSupplier lastRecord = allRecords.Where(b => b.id == lastId).SingleOrDefault<TblCustomerSupplier>();
                Assert.IsNotNull(lastRecord, "Customer/Supplier - Last Customer/Supplier record was not retrieved");

                // act
                if (lastRecord != null)
                {
                    lastRecord.active = false;
                    lastRecord.name = "Made Inactive - Test Customer/Supplier";
                    customerSupplierRepository.Update(lastRecord);
                    unitOfWork.Save();
                }
            }
            catch (Exception)
            {
                // assert
                Assert.Fail("Customer/Supplier - Making inactive (update) failed");
                return;
            }
        }

        // get by primary key
        [TestMethod]
        public void TestGetByPrimaryKeyCustSupplier()
        {
            // act
            try
            {
                IList<TblCustomerSupplier> allRecords = customerSupplierRepository.GetAll().ToList<TblCustomerSupplier>();
                Assert.IsNotNull(allRecords, "");
                int lastId = allRecords.Max(b => b.id);
                TblCustomerSupplier lastRecord = allRecords.Where(b => b.id == lastId).SingleOrDefault<TblCustomerSupplier>();
                // assert
                Assert.IsNotNull(lastRecord, "Customer/Supplier - Get by Primary key not working");
            }
            catch (Exception)
            {
                // assert
                Assert.Fail("Customer/Supplier - Get By Primary Key Failed");
                return;
            }
        }

        // get all
        [TestMethod]
        public void TestGetAllCustSupplier()
        {          
            try
            {
                IList<TblCustomerSupplier> allRecords = customerSupplierRepository.GetAll().ToList<TblCustomerSupplier>();

                if (allRecords.Any() == false)
                {
                    Assert.Fail("Customer/Supplier - No Cusotmer/Supplier retreived from the DB");
                }
            }
            catch (Exception)
            {
                Assert.Fail("Customer/Supplier - Get all businesses failed");
                return;
            }
        }

    }
}

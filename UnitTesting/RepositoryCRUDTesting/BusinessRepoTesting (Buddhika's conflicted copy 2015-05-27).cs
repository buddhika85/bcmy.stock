using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using GenericRepository_UnitOfWork.UOW;
using System.Collections;
using DataAccess_EF.EntityFramework;
using System.Collections.Generic;
using System.Linq;
using GenericRepository_UnitOfWork.GR;

namespace UnitTesting.RepositoryCRUDTesting
{
    [TestClass]
    public class BusinessRepoTesting
    {
        [TestMethod]
        public void TestInsert()
        {                        
            // arrange
            UnitOfWork unitOfWork = new UnitOfWork();
            GenericRepository<TblBusiness> businessRepo = unitOfWork.BusinessRepository;
            int actualCount = businessRepo.GetAll().Count();
            int expectedCount = ++actualCount;
            TblBusiness business = new TblBusiness() {                
                name = "Test Business 1",
                logo = null,
                addressLine1 = "123",
                addressLine2 = "Elm Grove",
                addressLine3 = "Worthing",
                postcode = "WA1 3RW",
                country = "UK",
                bank = "Santander",
                accountNumber = "0987654321",
                sortcode = "4567",
                iban = "12",
                swift = "34"
            };

            // act
            try
            {
                businessRepo.Insert(business);
                unitOfWork.Save();
                actualCount = businessRepo.GetAll().Count();
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
        public void TestUpdate()
        {
            // arrange
            UnitOfWork unitOfWork = new UnitOfWork();
            GenericRepository<TblBusiness> businessRepo = unitOfWork.BusinessRepository;

            // act
            try
            {
                IList<TblBusiness> allBusinesses = businessRepo.GetAll().ToList<TblBusiness>();
                int lastBusinessId = allBusinesses.Max(b => b.id);
                TblBusiness lastBusiness = allBusinesses.Where(b => b.id == lastBusinessId).SingleOrDefault<TblBusiness>();
                Assert.IsNotNull(lastBusiness, "Business - Last Business was not retrieved");
                if (lastBusiness != null)
                {
                    lastBusiness.name = "Updated - Test Business";
                    businessRepo.Update(lastBusiness);
                    unitOfWork.Save();
                }
            }
            catch (Exception)
            {
                // assert
                Assert.Fail("Business - Update fialed");
                return;
            }
        }

        [TestMethod]
        public void TestGetByPrimaryKey()
        {
            // arrange
            UnitOfWork unitOfWork = new UnitOfWork();
            GenericRepository<TblBusiness> businessRepository = unitOfWork.BusinessRepository;

            // act
            try
            {
                IList<TblBusiness> allBusinesses = businessRepository.GetAll().ToList<TblBusiness>();
                Assert.IsNotNull(allBusinesses, "");
                int lastId = allBusinesses.Max(b => b.id);
                TblBusiness lastBusiness = businessRepository.GetByPrimaryKey(lastId);
                // assert
                Assert.IsNotNull(lastBusiness, "Business - Get by Primary key not working");
            }
            catch (Exception)
            {
                // assert
                Assert.Fail("Business - Get By Primary Key Failed");
                return;
            }
        }

        [TestMethod]
        public void TestGetAll()
        {
            // arrange
            UnitOfWork unitOfWork = new UnitOfWork();
            try
            {
                List<TblBusiness> businesses = unitOfWork.BusinessRepository.GetAll().ToList<TblBusiness>();

                if (businesses.Any() == false)
                {
                    Assert.Fail("Business - No Businesses retreived from the DB");
                }
            }
            catch (Exception)
            {
                Assert.Fail("Business - Get all businesses failed");
                return;
            }
            
        }

        [TestMethod]
        public void TestDelete()
        {
            // arrange
            UnitOfWork unitOfWork = new UnitOfWork();
            GenericRepository<TblBusiness> businessRepo = unitOfWork.BusinessRepository;

            // act
            try
            {
                IList<TblBusiness> allBusinesses = businessRepo.GetAll().ToList<TblBusiness>();
                int lastId = allBusinesses.Max(b => b.id);
                int countBeforeDel = allBusinesses.Count();
                businessRepo.Delete(lastId);
                unitOfWork.Save();
                int expectedCount = --countBeforeDel;
                int actualCount = businessRepo.GetAll().ToList<TblBusiness>().Count();
                Assert.AreEqual(expectedCount, actualCount, "Business - After the deletion expected and actual record counts do not match");
            }
            catch (Exception)
            {
                Assert.Fail("Business - Delete failed");
                return;
            }            
        }

    }
}

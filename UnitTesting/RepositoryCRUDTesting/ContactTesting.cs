using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using UnitTesting.UnityDIContainer;
using GenericRepository_UnitOfWork.UOW;
using DataAccess_EF.EntityFramework;
using GenericRepository_UnitOfWork.GR;
using System.Collections.Generic;
using System.Linq;
using System.Data.SqlClient;
using System.Data;
using DataAccess_EF.ViewModels;

namespace UnitTesting.RepositoryCRUDTesting
{
    [TestClass]
    public class ContactTesting
    {
        // objects that can be reused with in the unit test class
        ObjectProvider objectProvider = null;
        UnitOfWork unitOfWork = null;
        GenericRepository<TblContact> contactRepository = null;

        /// <summary>
        /// constructor 
        /// </summary>
        public ContactTesting()
        {
            objectProvider = new ObjectProvider();
            unitOfWork = objectProvider.UnitOfWork;
            contactRepository = unitOfWork.ContactRepository;
        }

        // Get all
        [TestMethod]
        public void TestGetAllContacts()
        {
            try
            {
                IList<TblContact> allRecords = contactRepository.GetAll().ToList<TblContact>();

                if (allRecords.Any() == false)
                {
                    Assert.Fail("Contact - No contact records retreived from the DB");
                }
            }
            catch (Exception)
            {
                Assert.Fail("Contact - Get all contact records failed");
                return;
            }
        }

        // Get by primary key
        [TestMethod]
        public void TestGetByPrimaryKeyContact()
        {
            // act
            try
            {
                IList<TblContact> allRecords = contactRepository.GetAll().ToList<TblContact>();
                Assert.IsNotNull(allRecords, "");
                int lastId = allRecords.Max(b => b.id);
                TblContact lastRecord = allRecords.Where(b => b.id == lastId).SingleOrDefault<TblContact>();
                // assert
                Assert.IsNotNull(lastRecord, "Contact - Get by Primary key not working");
            }
            catch (Exception)
            {
                // assert
                Assert.Fail("Contact - Get By Primary Key Failed");
                return;
            }
        }

        // Insert
        [TestMethod]
        public void TestInsertContact()
        {
            // arrange            
            int actualCount = contactRepository.GetAll().Count();
            int expectedCount = ++actualCount;
            TblContact contact = objectProvider.Contact;
            contact.title = "Mr";
            contact.firstName = "Mathew";
            contact.lastName = "Hayden";
            contact.position = "Senior Consultant";
            contact.directDial = "123456789";
            contact.email = "mHayden@acb.com";
            contact.status = "active";
            contact.notes = "likes to play attacking cricket";
            contact.customerSupplierId = 5;

            // act
            try
            {
                contactRepository.Insert(contact);
                unitOfWork.Save();
                actualCount = contactRepository.GetAll().Count();
            }
            catch (Exception)
            {
                // assert
                Assert.Fail("Contact - Insertion Failed");
                return;
            }

            // assert
            Assert.AreEqual(expectedCount, actualCount, "Contact - Excpected and actual record counts after insertion do not match");
        }

        // Update
        // Make inactive - change status
        // Delete
        [TestMethod]
        public void TestMakeInactiveContact()
        {
            try
            {
                // arrange
                IList<TblContact> allRecords = contactRepository.GetAll().ToList<TblContact>();
                int lastId = allRecords.Max(b => b.id);
                TblContact lastRecord = allRecords.Where(b => b.id == lastId).SingleOrDefault<TblContact>();
                Assert.IsNotNull(lastRecord, "Contact - Last Contact record was not retrieved");

                // act
                if (lastRecord != null)
                {
                    lastRecord.status = "inactive";
                    lastRecord.notes += "Made Inactive on : " + DateTime.Now;
                    contactRepository.Update(lastRecord);
                    unitOfWork.Save();
                }
            }
            catch (Exception)
            {
                // assert
                Assert.Fail("Contact - Making inactive (update) failed");
                return;
            }
        }
        
        // Test SP_GetContactInfo
        // Ref - http://stackoverflow.com/questions/27974080/using-generic-repository-and-stored-procedures
        // Ref - http://www.codedisqus.com/0HieUqXkUj/how-can-i-use-a-stored-procedure-repository-unit-of-work-patterns-in-entity-framework.html
        [TestMethod]
        public void Test_SP_GetContactInfo()
        {
            try
            {
                var result = contactRepository.SQLQuery<ContactsViewModel>("SP_GetContactInfo @contactId", new SqlParameter("contactId", SqlDbType.Int) { Value = 2 });
                ContactsViewModel vm = result.SingleOrDefault<ContactsViewModel>();    
                   
                if (vm == null)
                {
                    Assert.Fail("Contact - No contact info retreived from the DB");
                }
            }
            catch (Exception)
            {
                Assert.Fail("Contact - Get contact info failed");
                return;
            }
        }

        // Test SP_GetContactsWithCompanyNames
        // Ref - http://stackoverflow.com/questions/27974080/using-generic-repository-and-stored-procedures
        // Ref - http://www.codedisqus.com/0HieUqXkUj/how-can-i-use-a-stored-procedure-repository-unit-of-work-patterns-in-entity-framework.html
        [TestMethod]
        public void Test_SP_GetContactsWithCompanyNames()
        {
            try
            {
                var result = contactRepository.SQLQuery<ContactsViewModel>("SP_GetContactsWithCompanyNames", null);
                IList<ContactsViewModel> vmList = result.ToList<ContactsViewModel>();

                if (vmList == null)
                {
                    Assert.Fail("Contact - No contact info retreived from the DB");
                }
            }
            catch (Exception)
            {
                Assert.Fail("Contact - Get contact info failed");
                return;
            }
        }

    }
}

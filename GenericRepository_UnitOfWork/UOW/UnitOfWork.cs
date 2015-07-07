using DataAccess_EF.EntityFramework;
using GenericRepository_UnitOfWork.GR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GenericRepository_UnitOfWork.UOW
{
    // Allows transaction handling 
    // Mainly allows connected classes/entities to be committed as a single transaction
    public class UnitOfWork : IDisposable
    {
        #region PROPERTIES
        private BCMY_StockEntities _context = new BCMY_StockEntities();
        private bool disposed = false;
        #endregion PROPERTIES

        #region REPOSITORIES

        // all the table/entity specific repositories as instances
        private GenericRepository<TblBusiness> businessRepository;
        private GenericRepository<TblCustomerSupplier> customerSupplierRepository;
        private GenericRepository<TblContact> contactRepository;
        private GenericRepository<TblOrder> orderRepository;
        private GenericRepository<TblOrderLine> orderLineRepository;
        private GenericRepository<TblNegotiation> negotiationRepository;
                
        // add more repositories below
        // ...
        // ..

        // properties to return table/entity specific repository instances
        public GenericRepository<TblBusiness> BusinessRepository
        {
            get 
            { 
                if (businessRepository == null)
                {
                    businessRepository = new GenericRepository<TblBusiness>(_context);
                }
                return businessRepository;
            }  
        }
        public GenericRepository<TblCustomerSupplier> CustomerSupplierRepository
        {
            get 
            {
                if (customerSupplierRepository == null)
                {
                    customerSupplierRepository = new GenericRepository<TblCustomerSupplier>(_context);
                }
                return customerSupplierRepository;
            }
        }
        public GenericRepository<TblContact> ContactRepository
        {
            get 
            {
                if (contactRepository == null)
                {
                    contactRepository = new GenericRepository<TblContact>(_context);
                }
                return contactRepository;
            }            
        }
        public GenericRepository<TblOrder> OrderRepository
        {
            get
            {
                if (orderRepository == null)
                {
                    orderRepository = new GenericRepository<TblOrder>(_context);
                }
                return orderRepository;
            }   
        }
        public GenericRepository<TblOrderLine> OrderLineRepository
        {
            get
            {
                if (orderLineRepository == null)
                {
                    orderLineRepository = new GenericRepository<TblOrderLine>(_context);
                }
                return orderLineRepository;
            }
        }
        public GenericRepository<TblNegotiation> NegotiationRepository
        {
            get
            {
                if (negotiationRepository == null)
                {
                    negotiationRepository = new GenericRepository<TblNegotiation>(_context);
                }
                return negotiationRepository;
            }
        }
        // add more repositories below
        // ...
        // ..

        #endregion REPOSITORIES


        // save and commit to the DB
        public void Save()
        {
            _context.SaveChanges();
        }

        // clean and release the resouces
        public void Dispose()
        {
            if (disposed == false)
            {
                _context.Dispose();
                disposed = true;
                GC.SuppressFinalize(this);
            }
        }

    }
}

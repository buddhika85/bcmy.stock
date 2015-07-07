using DataAccess_EF.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GenericRepository_UnitOfWork.GR
{
    // A common repository for all the entities via Generics
    public class GenericRepository<TEntity> where TEntity : class
    {
        #region PROPERTIES
        internal DbContext _context;
        internal DbSet<TEntity> dbSet;
        #endregion PROPERTIES

        // constructor
        public GenericRepository(DbContext context)
        {
            _context = context;
            dbSet = context.Set<TEntity>();
        }

        #region CRUD
        // get all
        public virtual IEnumerable<TEntity> GetAll()
        {
            IQueryable<TEntity> query = dbSet;
            return query.ToList<TEntity>();
        }

        // get by primary key
        public virtual TEntity GetByPrimaryKey(object primaryKey)
        {
            return dbSet.Find(primaryKey);
        }

        // insert
        public virtual void Insert(TEntity tentity)
        {
            dbSet.Add(tentity);
        }

        // update
        public virtual void Update(TEntity tentity)
        {
            dbSet.Attach(tentity);
            _context.Entry(tentity).State = EntityState.Modified;
        }

        // delete
        public virtual void Delete(object primaryKey)
        {
            TEntity entityToDel = dbSet.Find(primaryKey);
            if (_context.Entry(entityToDel).State == EntityState.Detached)
            {
                dbSet.Attach(entityToDel);
            }
            dbSet.Remove(entityToDel);
        }
        #endregion CRUD

        //// executing a stored procedure
        //// Ref - http://stackoverflow.com/questions/18201646/repository-pattern-to-execute-a-stored-procedure-using-entity-framework
        //public IEnumerable<TEntity> ExecWithStoreProcedure(string query, params object[] parameters)
        //{
        //    return _context.Database.SqlQuery<TEntity>(query, parameters);
        //}

        // Executing a stored procedure
        // Ref - http://stackoverflow.com/questions/27974080/using-generic-repository-and-stored-procedures
        // Ref - http://www.codedisqus.com/0HieUqXkUj/how-can-i-use-a-stored-procedure-repository-unit-of-work-patterns-in-entity-framework.html
        public DbRawSqlQuery<TEntity> SQLQuery<TEntity>(string sql, params object[] parameters)
        {
            if (parameters != null)
            {
                return _context.Database.SqlQuery<TEntity>(sql, parameters);
            }
            else 
            {
                return _context.Database.SqlQuery<TEntity>(sql);
            }
        }
    }
}

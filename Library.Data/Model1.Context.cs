﻿//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Library.Data
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class LibraryEntities : DbContext
    {
        public LibraryEntities()
            : base("name=LibraryEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public DbSet<Author> Author { get; set; }
        public DbSet<BookBorrowFee> BookBorrowFee { get; set; }
        public DbSet<BookDetails> BookDetails { get; set; }
        public DbSet<BookRequest> BookRequest { get; set; }
        public DbSet<Books> Books { get; set; }
        public DbSet<BorrowedBooks> BorrowedBooks { get; set; }
        public DbSet<Campus> Campus { get; set; }
        public DbSet<ResourceTypes> ResourceTypes { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<UserTypes> UserTypes { get; set; }
    }
}

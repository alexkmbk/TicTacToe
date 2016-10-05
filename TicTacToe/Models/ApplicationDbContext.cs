﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
//using Microsoft.AspNet.Identity.EntityFramework;
//using Microsoft.Data.Entity;
//using Microsoft.Data.Entity.Metadata;
using System.Data.Entity;

namespace TicTacToe.Models
{
    public class ApplicationDbContext : DbContext
    {
        // В базе данных, кроме стандартных сведений о пользователях,
        public DbSet<Game> Games { get; set; }
        public DbSet<GameMove> GameMoves { get; set; }
        
        protected override void OnModelCreating(DbModelBuilder builder)
        {
            base.OnModelCreating(builder);
            /*foreach (var relationship in builder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }*/

            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }
        /*protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseSqlServer(@"Server=(localdb)\\MSSQLLocalDB;Database=TicTacToe;Trusted_Connection=True;");
            // Строка подключения к серверу БК Postgre SQL
            //options.UseNpgsql(@"Server=127.0.0.1;Port=5432;Database=Customers;Integrated Security=true;User Id=postgres;Password=123;");
        }*/
    }
}

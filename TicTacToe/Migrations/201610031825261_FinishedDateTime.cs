namespace TicTacToe.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FinishedDateTime : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Games", "Finished", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Games", "Finished", c => c.DateTime(nullable: false));
        }
    }
}

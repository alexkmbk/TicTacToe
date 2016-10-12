namespace TicTacToe.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.GameMoves",
                c => new
                    {
                        GameMoveId = c.Int(nullable: false, identity: true),
                        MoveOrder = c.Int(nullable: false),
                        Row = c.Int(nullable: false),
                        Col = c.Int(nullable: false),
                        Game_GameId = c.Int(),
                    })
                .PrimaryKey(t => t.GameMoveId)
                .ForeignKey("dbo.Games", t => t.Game_GameId)
                .Index(t => t.Game_GameId);
            
            CreateTable(
                "dbo.Games",
                c => new
                    {
                        GameId = c.Int(nullable: false, identity: true),
                        GameType = c.Int(nullable: false),
                        GameStatus = c.Int(nullable: false),
                        Player1Id = c.Guid(nullable: false),
                        Player2Id = c.Guid(nullable: false),
                        Started = c.DateTime(nullable: false),
                        Finished = c.DateTime(),
                    })
                .PrimaryKey(t => t.GameId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.GameMoves", "Game_GameId", "dbo.Games");
            DropIndex("dbo.GameMoves", new[] { "Game_GameId" });
            DropTable("dbo.Games");
            DropTable("dbo.GameMoves");
        }
    }
}

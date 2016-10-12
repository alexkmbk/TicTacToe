using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using TicTacToe.Models;

namespace TicTacToe.Controllers
{

    public class TicTacToeController : Controller
    {
        ApplicationDbContext _ctx = new ApplicationDbContext();

        public TicTacToeController()
        {

        }

        // GET: TicTacToe
        public ActionResult Index()
        {
             return View();
        }

        // POST: NewGame
        [HttpPost]
        public ActionResult NewGame(GameMode GameMode, int PlayerNum = 0)
        {
            Game game = new Game();
            game.Started = DateTime.Now;
            if (GameMode == GameMode.WithUser)
            {
                game.GameStatus = GameStatus.Open;

                if (PlayerNum == 0)
                    PlayerNum = new Random().Next(1, 2);

                if (PlayerNum == 1)
                {
                    game.Player1Id = System.Guid.NewGuid();
                    Session["PlayerID"] = game.Player1Id.ToString();
                }
                else if (PlayerNum == 2)
                {
                    game.Player2Id = System.Guid.NewGuid();
                    Session["PlayerID"] = game.Player2Id.ToString();
                }
            }
            else
                game.GameStatus = GameStatus.Started;
            _ctx.Games.Add(game);
            _ctx.SaveChanges();

            Session["GameID"] = game.GameId.ToString();
            return Json(new { isOk = true, errors = "", playerNum = PlayerNum, gameId = game.GameId});
        }

        // POST: NewGame
        [HttpPost]
        public ActionResult JoinGame(int GameId)
        {

            Game game = _ctx.Games.FirstOrDefault(e => e.GameId == GameId);
            if (game == null)
                return Json(new { isOk = false, errors = "Game ID was not found" });

            if (game.GameStatus == GameStatus.Started)
                return Json(new { isOk = false, errors = "The game is already started" });

            else if (game.GameStatus == GameStatus.Finished)
                return Json(new { isOk = false, errors = "The game is already finished, you are welcome to create a new one" });

            int playerNum = 0;
            game.GameStatus = GameStatus.Started;

            if (game.Player1Id == null)
            {
                playerNum = 1;
                game.Player1Id = System.Guid.NewGuid();
                Session["PlayerId"] = game.Player1Id.ToString();
            }
            else {
                playerNum = 2;
                game.Player2Id = System.Guid.NewGuid();
                Session["PlayerId"] = game.Player2Id.ToString();
            }

            _ctx.SaveChanges();

            Session["GameID"] = game.GameId.ToString();
            
            //Session["PlayerID"] = game.GameId.ToString();
            return Json(new { isOk = true, errors = "", playerNum = playerNum});
        }


        // POST: ComputerMove
        [HttpPost]
        public ActionResult ComputerMove(int playerNum, int[][] board, int lastMoveNum)
        {
            Cell res = TicTacToeGame.ComputerMove(playerNum, board);
            if (res == null)
                return Json(new { isOk = false, errors = "" });
            else {
                var objGameID = Session["GameID"];
                if (objGameID == null)
                {
                    return Json(new { isOk = false, errors = "Getting session parameter error." });
                }
                int gameID = Int32.Parse(objGameID.ToString());
                Game game = _ctx.Games.FirstOrDefault(e => e.GameId == gameID);
                _ctx.GameMoves.Add(new GameMove {Game=game, Row = res.row, Col=res.col, MoveOrder = lastMoveNum + 1});
                try
                {
                    _ctx.SaveChanges();
                }
                catch (Exception e)
                {
                    return Json(new { isOk = false, errors = e.Message});
                }
                return Json(new { isOk = true, errors = "", row = res.row, col=res.col});
            }
        }

        // POST: UserMove
        public ActionResult UserMove(int row, int col, int lastMoveNum)
        {
            var objGameID = Session["GameID"];
            if (objGameID == null)
            {
                return Json(new { isOk = false, errors = "Getting session parameter error." });
            }
            int gameID = Int32.Parse(objGameID.ToString());
            Game game = _ctx.Games.FirstOrDefault(e => e.GameId == gameID);
            game.GameId = gameID;
            _ctx.GameMoves.Add(new GameMove { Game = game, Row = row, Col = col, MoveOrder = lastMoveNum});
            try
            {
                _ctx.SaveChanges();
            }
            catch (Exception e)
            {
                return Json(new { isOk = false, errors = e.Message });
            }

             return Json(new { isOk = true, errors = ""});
        }

        // POST: FinishGame
        public ActionResult FinishGame()
        {
            var objGameID = Session["GameID"];
            if (objGameID == null)
            {
                return Json(new { isOk = false, errors = "Getting session parameter error." });
            }
            int gameID = Int32.Parse(objGameID.ToString());
            Game game = _ctx.Games.FirstOrDefault(e => e.GameId == gameID);
            game.Finished = DateTime.Now;
            try
            {
                _ctx.SaveChanges();
            }
            catch (Exception e)
            {
                return Json(new { isOk = false, errors = e.Message });
            }

            return Json(new { isOk = true, errors = "" });
        }
    }
}
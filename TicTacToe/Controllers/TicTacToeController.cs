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
        public ActionResult NewGame()
        {
            Game game = new Game();
            game.Started = DateTime.Now;
            _ctx.Games.Add(game);
            _ctx.SaveChanges();

            //Request.Cookies.Add(new HttpCookie("GameID", game.GameId.ToString()));//System.Guid.NewGuid().ToString()));
            Session["GameID"] = game.GameId.ToString();
            return Json(new { isOk = true, errors = ""});
        }

        // POST: ComputerMove
        [HttpPost]
        public ActionResult ComputerMove(int playerNum, int[][] board, int lastMoveNum)
        {
            //Request.Cookies["GameID"].Value;
            //Request.Cookies.Add(new HttpCookie("GameID", System.Guid.NewGuid().ToString()));
            Cell res = TicTacToeGame.ComputerMove(playerNum, board);
            if (res == null)
                return Json(new { isOk = false, errors = "" });
            else {
                int gameID = Int32.Parse(Session["GameID"].ToString());
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
            int gameID = Int32.Parse(Session["GameID"].ToString());
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
            int gameID = Int32.Parse(Session["GameID"].ToString());
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
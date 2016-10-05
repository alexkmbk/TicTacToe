using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TicTacToe;

namespace UnitTests
{
    [TestClass]
    public class ComputerMoveAlgorithmTesting
    {
        [TestMethod]
        public void DoNotAllowToWinOpponent()
        {
            int playerNum = 1;

            int[][] board = new int[3][];
            board[0] = new int[3] { -1, 0, -1 };
            board[1] = new int[3] { -1, -1, -1 };
            board[2] = new int[3] { -1, 0, -1 };
            var res = TicTacToeGame.ComputerMove(playerNum, board);
            Assert.AreEqual<int>(1,res.col);
            Assert.AreEqual<int>(1, res.row);

            board[0] = new int[3] { -1, -1, 0 };
            board[1] = new int[3] { -1, 0, -1 };
            board[2] = new int[3] { -1, -1, -1 };
            res = TicTacToeGame.ComputerMove(playerNum, board);
            Assert.AreEqual<int>(0, res.col);
            Assert.AreEqual<int>(2, res.row);

            board[0] = new int[3] { 0, -1, -1 };
            board[1] = new int[3] { -1, 0, -1 };
            board[2] = new int[3] { -1, -1, -1 };
            res = TicTacToeGame.ComputerMove(playerNum, board);
            Assert.AreEqual<int>(2, res.col);
            Assert.AreEqual<int>(2, res.row);

            board[0] = new int[3] { 0, -1, -1 };
            board[1] = new int[3] { -1, -1, -1 };
            board[2] = new int[3] { -1, -1, 0 };
            res = TicTacToeGame.ComputerMove(playerNum, board);
            Assert.AreEqual<int>(1, res.col);
            Assert.AreEqual<int>(1, res.row);
        }

        [TestMethod]
        public void TryToWinThemselves()
        {
            int playerNum = 1;

            int[][] board = new int[3][];
            board[0] = new int[3] { -1, 1, -1 };
            board[1] = new int[3] { -1, -1, -1 };
            board[2] = new int[3] { -1, 1, -1 };
            var res = TicTacToeGame.ComputerMove(playerNum, board);
            Assert.AreEqual<int>(1, res.col);
            Assert.AreEqual<int>(1, res.row);

            board[0] = new int[3] { -1, -1, 1 };
            board[1] = new int[3] { -1, 1, -1 };
            board[2] = new int[3] { -1, -1, -1 };
            res = TicTacToeGame.ComputerMove(playerNum, board);
            Assert.AreEqual<int>(0, res.col);
            Assert.AreEqual<int>(2, res.row);


            board[0] = new int[3] { 1, -1, -1 };
            board[1] = new int[3] { -1, 1, -1 };
            board[2] = new int[3] { -1, -1, -1 };
            res = TicTacToeGame.ComputerMove(playerNum, board);
            Assert.AreEqual<int>(2, res.col);
            Assert.AreEqual<int>(2, res.row);

            board[0] = new int[3] { 1, -1, -1 };
            board[1] = new int[3] { -1, -1, -1 };
            board[2] = new int[3] { -1, -1, 1 };
            res = TicTacToeGame.ComputerMove(playerNum, board);
            Assert.AreEqual<int>(1, res.col);
            Assert.AreEqual<int>(1, res.row);

        }
    }
}

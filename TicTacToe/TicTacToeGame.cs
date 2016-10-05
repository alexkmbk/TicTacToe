using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TicTacToe
{
    public class RowCombination
    {
        public List<Cell> SpareCells;
        public List<Cell> FilledCells;
        public RowCombination()
        {
            SpareCells = new List<Cell>();
            FilledCells = new List<Cell>();
        }
    }
    public class Cell
    {
        public Cell(int _row, int _col)
        {
            row = _row;
            col = _col;
        }
        public int row;
        public int col;
    }

    public static class TicTacToeGame
    {
        public static Cell ComputerMove(int playerNum, int[][] board)
        {
            // First of all let's check possible win combinations
            int checkingVal = playerNum == 1 ? 1 : 0;
            SortedDictionary<int, RowCombination> rowCombinations = new SortedDictionary<int, RowCombination>();

            CheckingCrossings(checkingVal, board, rowCombinations);

            if (!rowCombinations.ContainsKey(2))
                CheckingRows(checkingVal, board, rowCombinations);

            if (!rowCombinations.ContainsKey(2))
                CheckingCols(checkingVal, board, rowCombinations);

            if (rowCombinations.Count > 0 && rowCombinations.LastOrDefault().Value.FilledCells.Count == 2) 
                return rowCombinations.LastOrDefault().Value.SpareCells[0];

            // If there is no win combination, let's don't give a chance to win our opponent then
            checkingVal = playerNum == 1 ? 0 : 1;
            rowCombinations = new SortedDictionary<int, RowCombination>();

            CheckingCrossings(checkingVal, board, rowCombinations);

            if (!rowCombinations.ContainsKey(2))
                CheckingRows(checkingVal, board, rowCombinations);

            if (!rowCombinations.ContainsKey(2))
                CheckingCols(checkingVal, board, rowCombinations);

            if (rowCombinations.Count > 0)
                return rowCombinations.LastOrDefault().Value.SpareCells[0];
            else
                return new Cell(1, 1);
        }

        private static void CheckingCrossings(int checkingVal, int[][] board, SortedDictionary<int,RowCombination> RowCombinations)
        {
            RowCombination comb = new RowCombination();

            for (int row = 0; row < 3; row++)
            {
                if (board[row][row] == checkingVal)
                {
                    comb.FilledCells.Add(new Cell(row, row));
                }
                else if (board[row][row] == -1)
                {
                    comb.SpareCells.Add(new Cell(row, row));
                }
            }

            // if threre are any filled cells in the combination
            if (comb.FilledCells.Count > 0 && comb.SpareCells.Count > 0 && !RowCombinations.ContainsKey(comb.FilledCells.Count))
                RowCombinations.Add(comb.FilledCells.Count, comb);

            comb = new RowCombination();

            int col = 0;
            for (int row = 2; row >= 0; row--)
            {
                if (board[row][col] == checkingVal)
                {
                    comb.FilledCells.Add(new Cell(row, col));
                }
                else if (board[row][col] == -1)
                {
                    comb.SpareCells.Add(new Cell(row, col));
                }
                col++;
            }

            // if threre are any filled cells in the combination
            if (comb.FilledCells.Count > 0 && comb.SpareCells.Count > 0 && !RowCombinations.ContainsKey(comb.FilledCells.Count))
                RowCombinations.Add(comb.FilledCells.Count, comb);

        }

        private static void CheckingRows(int checkingVal, int[][] board, SortedDictionary<int, RowCombination> RowCombinations)
        {
            for (int row = 0; row < 3; row++)
            {
                RowCombination comb = new RowCombination();
                for (int col = 0; col < 3; col++)
                {
                    if (board[row][col] == checkingVal)
                    {
                        comb.FilledCells.Add(new Cell(row, col));
                    }
                    else if (board[row][col] == -1)
                    {
                        comb.SpareCells.Add(new Cell(row, col));
                    }
                }
                if (comb.FilledCells.Count > 0 && comb.SpareCells.Count > 0 && !RowCombinations.ContainsKey(comb.FilledCells.Count))
                    RowCombinations.Add(comb.FilledCells.Count, comb);
            }
        }

        private static void CheckingCols(int checkingVal, int[][] board, SortedDictionary<int, RowCombination> RowCombinations)
        {
            for (int col = 0; col < 3; col++)
            {
                RowCombination comb = new RowCombination();
                for (int row = 0; row < 3; row++)
                {
                    if (board[row][col] == checkingVal)
                    {
                        comb.FilledCells.Add(new Cell(row, col));
                    }
                    else if (board[row][col] == -1)
                    {
                        comb.SpareCells.Add(new Cell(row, col));
                    }
                }
                if (comb.FilledCells.Count > 0 && comb.SpareCells.Count > 0 && !RowCombinations.ContainsKey(comb.FilledCells.Count))
                    RowCombinations.Add(comb.FilledCells.Count, comb);
            }

        }
    }
}
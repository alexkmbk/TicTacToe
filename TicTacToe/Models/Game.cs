using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TicTacToe.Models
{
    // data model for storing played games identifiers 
    public class Game
    {
        public int GameId { get; set; }

        public GameMode GameType { get; set; }

        public GameStatus GameStatus { get; set; }

        public Guid Player1Id { get; set; }

        public Guid Player2Id { get; set; }

        public DateTime Started { get; set; }
        public DateTime? Finished { get; set; }

        public virtual ICollection<GameMove> GameMoves { get; set; }

        public Game()
        {
            GameMoves = new List<GameMove>();
        }
    }

    public class GameMove
    {
        public int GameMoveId { get; set; }
        public int MoveOrder { get; set; }
        public int Row { get; set; }
        public int Col { get; set; }
        public virtual Game Game { get; set; }
    }


}

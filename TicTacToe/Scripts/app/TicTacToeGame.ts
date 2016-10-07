class Cell {
    public row: number;
    public col: number;
    constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
    }
}

enum GameStatus {
    notstarted = 0,
    started = 1,
    finished = 2
}

export class TicTacToeGame {

    public winner: number;
    public winCombination: Array<Cell>;
    public lastMoveNum: number;// number of last move

    private status: GameStatus;
    private _board: number[][];

    constructor() {
        this._board = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
        this.winner = 0;
        this.winCombination = new Array<Cell>();
        this.status = GameStatus.started;
        this.lastMoveNum = 0;
    }

    public GameIsFinished(): boolean {
        return this.status == GameStatus.finished;
    }

    public GetBoard(): number[][] {
        return this._board;
    }

    public Move(playerNum: number, row: number, col: number): boolean {
        if (this.status != GameStatus.started) {
            return false;
        }
        var val: number = this._board[row][col];
        if (val != -1)
            return false;
        // player 1 - x (cell value = 1)
        // player 2 - o (cell value = 0)
        this._board[row][col] = playerNum == 1 ? 1 : 0;

        // Checking if there is a winner
        this.BoardCheck(playerNum);

        this.lastMoveNum++;
        return true;
    }

    private CheckingCrossings(checkingVal: number): boolean {
        this.winCombination = new Array<Cell>();
        for (var row: number = 0; row < 3; row++) {
            if (this._board[row][row] == checkingVal) {
                this.winCombination.push(new Cell(row, row));
                if (this.winCombination.length == 3) return true;
            }
        }
        this.winCombination = new Array<Cell>();
        var col = 0;
        for (var row = 2; row >= 0; row--) {
            if (this._board[row][col] == checkingVal) {
                this.winCombination.push(new Cell(row, col));
                if (this.winCombination.length == 3) return true;
            }
            col++;
        }
        return false;
    }


    private CheckingRows(checkingVal: number): boolean {
        for (var row = 0; row < 3; row++) {
            this.winCombination = new Array<Cell>();
            for (var col = 0; col < 3; col++) {
                if (this._board[row][col] == checkingVal) {
                    this.winCombination.push(new Cell(row, col));
                    if (this.winCombination.length == 3) return true;
                }
            }
        }
        return false;
    }

    private CheckingCols(checkingVal: number): boolean {
        for (var col = 0; col < 3; col++) {
            this.winCombination = new Array<Cell>();
            for (var row = 0; row < 3; row++) {
                if (this._board[row][col] == checkingVal) {
                    this.winCombination.push(new Cell(row, col));
                    if (this.winCombination.length == 3) return true;
                }
            }
        }
        return false;
    }

    // Checking if there are no spare cells
    private IsFilled(): boolean {
        for (var row = 0; row < 3; row++) {
            for (var col = 0; col < 3; col++) {
                if (this._board[row][col] == -1) {
                    return  false;
                }
            }
        }
        return true;
    }

    private BoardCheck(playerNum: number): void {
        var checkingVal: number = playerNum == 1 ? 1 : 0;

        this.winCombination = new Array<Cell>(3);

        if (this.CheckingCols(checkingVal)
            || this.CheckingRows(checkingVal)
            || this.CheckingCrossings(checkingVal)) {
            this.status = GameStatus.finished;
            this.winner = playerNum;
        }
        else if (this.IsFilled()) {
            // there are no winner (draw) but the board is filled
            this.status = GameStatus.finished;
            this.winner = 0;
        }
    }

}
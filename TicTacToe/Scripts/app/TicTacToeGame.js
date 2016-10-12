System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Cell, GameMode, GameStatus, TicTacToeGame;
    return {
        setters:[],
        execute: function() {
            Cell = (function () {
                function Cell(row, col) {
                    this.row = row;
                    this.col = col;
                }
                return Cell;
            }());
            exports_1("Cell", Cell);
            (function (GameMode) {
                GameMode[GameMode["WithComputer"] = 0] = "WithComputer";
                GameMode[GameMode["WithUser"] = 1] = "WithUser";
            })(GameMode || (GameMode = {}));
            exports_1("GameMode", GameMode);
            (function (GameStatus) {
                GameStatus[GameStatus["notstarted"] = 0] = "notstarted";
                GameStatus[GameStatus["started"] = 1] = "started";
                GameStatus[GameStatus["finished"] = 2] = "finished";
            })(GameStatus || (GameStatus = {}));
            TicTacToeGame = (function () {
                function TicTacToeGame() {
                    this._board = [[-1, -1, -1], [-1, -1, -1], [-1, -1, -1]];
                    this.winner = 0;
                    this.winCombination = new Array();
                    this.status = GameStatus.started;
                    this.lastMoveNum = 0;
                }
                TicTacToeGame.prototype.GameIsFinished = function () {
                    return this.status == GameStatus.finished;
                };
                TicTacToeGame.prototype.GetBoard = function () {
                    return this._board;
                };
                TicTacToeGame.prototype.Move = function (playerNum, row, col) {
                    if (this.status != GameStatus.started) {
                        return false;
                    }
                    var val = this._board[row][col];
                    if (val != -1)
                        return false;
                    // player 1 - x (cell value = 1)
                    // player 2 - o (cell value = 0)
                    this._board[row][col] = playerNum == 1 ? 1 : 0;
                    // Checking if there is a winner
                    this.BoardCheck(playerNum);
                    this.lastMoveNum++;
                    return true;
                };
                TicTacToeGame.prototype.CheckingCrossings = function (checkingVal) {
                    this.winCombination = new Array();
                    for (var row = 0; row < 3; row++) {
                        if (this._board[row][row] == checkingVal) {
                            this.winCombination.push(new Cell(row, row));
                            if (this.winCombination.length == 3)
                                return true;
                        }
                    }
                    this.winCombination = new Array();
                    var col = 0;
                    for (var row = 2; row >= 0; row--) {
                        if (this._board[row][col] == checkingVal) {
                            this.winCombination.push(new Cell(row, col));
                            if (this.winCombination.length == 3)
                                return true;
                        }
                        col++;
                    }
                    return false;
                };
                TicTacToeGame.prototype.CheckingRows = function (checkingVal) {
                    for (var row = 0; row < 3; row++) {
                        this.winCombination = new Array();
                        for (var col = 0; col < 3; col++) {
                            if (this._board[row][col] == checkingVal) {
                                this.winCombination.push(new Cell(row, col));
                                if (this.winCombination.length == 3)
                                    return true;
                            }
                        }
                    }
                    return false;
                };
                TicTacToeGame.prototype.CheckingCols = function (checkingVal) {
                    for (var col = 0; col < 3; col++) {
                        this.winCombination = new Array();
                        for (var row = 0; row < 3; row++) {
                            if (this._board[row][col] == checkingVal) {
                                this.winCombination.push(new Cell(row, col));
                                if (this.winCombination.length == 3)
                                    return true;
                            }
                        }
                    }
                    return false;
                };
                // Checking if there are no spare cells
                TicTacToeGame.prototype.IsFilled = function () {
                    for (var row = 0; row < 3; row++) {
                        for (var col = 0; col < 3; col++) {
                            if (this._board[row][col] == -1) {
                                return false;
                            }
                        }
                    }
                    return true;
                };
                TicTacToeGame.prototype.BoardCheck = function (playerNum) {
                    var checkingVal = playerNum == 1 ? 1 : 0;
                    this.winCombination = new Array(3);
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
                };
                return TicTacToeGame;
            }());
            exports_1("TicTacToeGame", TicTacToeGame);
        }
    }
});

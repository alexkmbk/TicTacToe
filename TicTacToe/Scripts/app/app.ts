
///<reference path="../lib/jquery/jquery.d.ts" />
///<reference path="./TicTacToeGame.ts" />
///<reference path="./BoardHTMLRender.ts" />
///<reference path="./BoardCanvasRender.ts" />

import { TicTacToeGame } from "./TicTacToeGame.js";
import { BoardHTMLRender } from "./BoardHTMLRender.js";
import { BoardCanvasRender } from "./BoardCanvasRender.js";
import { IBoardRender } from "./IBoardRender.js";

$("input[name='NewGameButton']").on('click', NewGame);

var userPlayerNum = 1;
var compPlayerNum = 2;
var mouseInputAvailable: boolean = true;
var game: TicTacToeGame;
var boardRender: IBoardRender;

boardRender = new BoardCanvasRender($('#gameboard_div'), MouseClick, 200);

// There is no CanvasIsSupported method in IBoardRender interface, so we need type casting
if (!(<BoardCanvasRender>boardRender).CanvasIsSupported()) 
    boardRender = new BoardHTMLRender($('#gameboard_div'), MouseClick);

function NewGame() {

    mouseInputAvailable = true;

    userPlayerNum = $("select[name='PlayerChoice']").val();
    if (userPlayerNum == 2) {
        mouseInputAvailable = false; // mouse input on the game board is not allowed
        compPlayerNum = 1;
    }
    else
        compPlayerNum = 2;

    mouseInputAvailable = true;
    $.ajax({
        type: 'POST',
        url: "http://" + window.location.host + "/TicTacToe/NewGame",
        success: function (data) {
            if (data["isOk"]) {
                $("#winnerinfo_div").html("");
                game = new TicTacToeGame();
                if (userPlayerNum == 2) {
                    $.ajax({
                        type: 'POST',
                        data:
                        { playerNum: compPlayerNum, board: game.GetBoard(), lastMoveNum: game.lastMoveNum },
                        url: "http://" + window.location.host + "/TicTacToe/ComputerMove",
                        success: function (data) {
                            if (data["isOk"]) {
                                game.Move(compPlayerNum, data['row'], data['col']);
                                if (game.GameIsFinished()) {
                                    AfterFinishingGame(game.winner);
                                }
                                boardRender.DrawBoard(game.GetBoard());
                            }
                            mouseInputAvailable = true;
                            return;
                        }
                    });
                }
                boardRender.DrawBoard(game.GetBoard());
            }
        }
    });
}

function AfterFinishingGame(winner: number) {
    $.ajax({
        type: 'POST',
        url: "http://" + window.location.host + "/TicTacToe/FinishGame",
        success: function (data) {
            if (winner == userPlayerNum)
                $("#winnerinfo_div").html("<H2>Вы выиграли!</H2>");
            else if (winner == compPlayerNum)
                $("#winnerinfo_div").html("<H2>Компьютер выиграл!</H2>");
            else
                $("#winnerinfo_div").html("<H2>Ничья!</H2>");
        }
    });
}

function MouseClick(_row: number, _col: number) {

    // If asynchronous request is still executing
    if (!mouseInputAvailable) return;

    if (!game.Move(userPlayerNum, _row, _col)) return;
    boardRender.DrawBoard(game.GetBoard());

    $.ajax({
        type: 'POST',
        data: { col: _col, row: _row, lastMoveNum: game.lastMoveNum },
        url: "http://" + window.location.host + "/TicTacToe/UserMove",
        success: function (data) {
            if (game.GameIsFinished()) {
                AfterFinishingGame(game.winner);
                }
            else {
                $.ajax({
                    type: 'POST',
                    data:
                    { playerNum: compPlayerNum, board: game.GetBoard(), lastMoveNum: game.lastMoveNum },
                    url: "http://" + window.location.host + "/TicTacToe/ComputerMove",
                    success: function (data) {
                        if (data["isOk"]) {
                            game.Move(compPlayerNum, data['row'], data['col']);
                            if (game.GameIsFinished()) {
                                AfterFinishingGame(game.winner);
                            }
                            boardRender.DrawBoard(game.GetBoard());
                        }
                        mouseInputAvailable = true;
                    }
                });
            }
        }
    });
}
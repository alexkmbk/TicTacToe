
///<reference path="../typings/TicTacToeHub.d.ts" />
///<reference path="./TicTacToeGame.ts" />
///<reference path="./BoardHTMLRender.ts" />
///<reference path="./BoardCanvasRender.ts" />



import { TicTacToeGame, GameMode, Cell } from "./TicTacToeGame.js";
import { BoardHTMLRender } from "./BoardHTMLRender.js";
import { BoardCanvasRender } from "./BoardCanvasRender.js";
import { IBoardRender } from "./IBoardRender.js";

$("input[name='NewGameButton']").on('click', NewGame);
$("input[name='JoinGameButton']").on('click', JoinGame);
$("select[name='GameMode']").on('change', GameModeChange);

var userPlayerNum = 1;
var opponentPlayerNum = 2;
var mouseInputAvailable: boolean = true;
var game: TicTacToeGame;
var boardRender: IBoardRender;
var gameMode: GameMode;

var hub: any;

$(function () {
    hub = $.connection.ticTacToeHub;
    hub.client.broadcastMessage = function (command, commandParams) {
        if (command == "JoinGame") {
            mouseInputAvailable = (userPlayerNum == 1 ? true: false);
            var msg = "<H4>Другой игрок присоединился к игре:</H4>";
            msg = msg + "<H4>Вы играете: " + (userPlayerNum == 1 ? "Крестиками" : "Ноликами") + "</H4>";
            msg = msg + "<H4>Ваш противник играет: " + (userPlayerNum == 1 ? "Ноликами" : "Крестиками") + "</H4>";
            $("#gameinfo_div").html(msg);
        }
        else if (command == "UserMove") {
            mouseInputAvailable = true;
            var cell = <Cell>JSON.parse(commandParams);
            if (game.Move(opponentPlayerNum, cell.row, cell.col)) {
                boardRender.DrawBoard(game.GetBoard());
            }
            if (game.GameIsFinished()) {
                AfterFinishingGame(game.winner);
                mouseInputAvailable = false;;
            }
        }
    };

    $.connection.hub.start();
});

boardRender = new BoardCanvasRender($('#gameboard_div'), MouseClick, 200);

// There is no CanvasIsSupported method in IBoardRender interface, so we need type casting
if (!(<BoardCanvasRender>boardRender).CanvasIsSupported()) 
    boardRender = new BoardHTMLRender($('#gameboard_div'), MouseClick);

function JoinGame() {
    var gameId = $("input[name='GameId']").val();
    if (!gameId || gameId.length === 0) {
        msg("Невозможно присоединиться к игре: не заполнен game ID");
        return;
    }

    hub.server.send("JoinGame", gameId);

    $.ajax({
        type: 'POST',
        data:
        { GameId: gameId},
        url: "http://" + window.location.host + "/TicTacToe/JoinGame",
        success: function (data) {
            if (data["isOk"]) {
                game = new TicTacToeGame();
                userPlayerNum = data["playerNum"];
                opponentPlayerNum = (userPlayerNum == 1 ? 2 : 1);
                boardRender.DrawBoard(game.GetBoard());
                mouseInputAvailable = (userPlayerNum == 1 ? true : false);

                var message = "<H4>Вы присоединились к игре:</H4>";
                message = message + "<H4>Вы играете: " + (userPlayerNum == 1 ? "Крестиками" : "Ноликами") + "</H4>";
                message = message + "<H4>Ваш противник играет: " + (userPlayerNum == 1 ? "Ноликами" : "Крестиками") + "</H4>";
                $("#gameinfo_div").html(message);
            }
            else
                msg("Не удалось присоединиться к игре: " + data["errors"]);
            return;
        },
        error: function (xhr, str) {
            msg("Не удалось присоединиться к игре: " + xhr.responseText);
        }

    });
}

function NewGame() {

    mouseInputAvailable = true;

    userPlayerNum = $("select[name='PlayerChoice']").val();
    gameMode = $("select[name='GameMode']").val();


    if (userPlayerNum == 2) {
        mouseInputAvailable = false; // mouse input on the game board is not allowed
        opponentPlayerNum = 1;
    }
    else
        opponentPlayerNum = 2;

    $.ajax({
        type: 'POST',
        data: { GameMode: gameMode, playerNum: userPlayerNum},
        url: "http://" + window.location.host + "/TicTacToe/NewGame",
        success: function (data) {
            if (data["isOk"]) {
                $("#gameinfo_div").html("");
                game = new TicTacToeGame();
                if (gameMode == GameMode.WithComputer && userPlayerNum == 2) {
                    $.ajax({
                        type: 'POST',
                        data:
                        { playerNum: opponentPlayerNum, board: game.GetBoard(), lastMoveNum: game.lastMoveNum },
                        url: "http://" + window.location.host + "/TicTacToe/ComputerMove",
                        success: function (data) {
                            if (data["isOk"]) {
                                game.Move(opponentPlayerNum, data['row'], data['col']);
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
                else if (gameMode == GameMode.WithUser) {
                    $("input[name='GameId']").val(data["gameId"]);
                    mouseInputAvailable = false;
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
                $("#gameinfo_div").html("<H2>Вы выиграли!</H2>");
            else if (winner == opponentPlayerNum) {
                if (gameMode == GameMode.WithComputer)
                    $("#gameinfo_div").html("<H2>Компьютер выиграл!</H2>");
                else
                    $("#gameinfo_div").html("<H2>Выиграл игрок №" + opponentPlayerNum + "!</H2>");
            }
            else
                $("#gameinfo_div").html("<H2>Ничья!</H2>");
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
            hub.server.send("UserMove", JSON.stringify(new Cell(_row, _col)));
            if (game.GameIsFinished()) {
                AfterFinishingGame(game.winner);
                }
            else if (gameMode == GameMode.WithComputer){
                $.ajax({
                    type: 'POST',
                    data:
                    { playerNum: opponentPlayerNum, board: game.GetBoard(), lastMoveNum: game.lastMoveNum },
                    url: "http://" + window.location.host + "/TicTacToe/ComputerMove",
                    success: function (data) {
                        if (data["isOk"]) {
                            game.Move(opponentPlayerNum, data['row'], data['col']);
                            if (game.GameIsFinished()) {
                                AfterFinishingGame(game.winner);
                            }
                            boardRender.DrawBoard(game.GetBoard());
                        }
                        mouseInputAvailable = true;
                    }
                });
            }
            else 
                mouseInputAvailable = false; // Cannot move because it is next player order
        }
    });


}

function GameModeChange() {
    if ($("select[name='GameMode']").val() == 0)
        $("input[name='JoinGameButton']").prop("disabled", true);
    else
        $("input[name='JoinGameButton']").prop("disabled", false);
}  
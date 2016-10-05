///<reference path="../lib/jquery/jquery.d.ts" />
///<reference path="./TicTacToeGame.ts" />
///<reference path="./BoardHTMLRender.ts" />
///<reference path="./BoardCanvasRender.ts" />
System.register(["./TicTacToeGame.js", "./BoardHTMLRender.js", "./BoardCanvasRender.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TicTacToeGame_js_1, BoardHTMLRender_js_1, BoardCanvasRender_js_1;
    var userPlayerNum, compPlayerNum, mouseInputAvailable, game, boardRender;
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
                    game = new TicTacToeGame_js_1.TicTacToeGame();
                    if (userPlayerNum == 2) {
                        $.ajax({
                            type: 'POST',
                            data: { playerNum: compPlayerNum, board: game.GetBoard(), lastMoveNum: game.lastMoveNum },
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
    function AfterFinishingGame(winner) {
        $.ajax({
            type: 'POST',
            url: "http://" + window.location.host + "/TicTacToe/FinishGame",
            success: function (data) {
                if (winner == userPlayerNum)
                    $("#winnerinfo_div").html("<H2>Вы выиграли!</H2>");
                else
                    $("#winnerinfo_div").html("<H2>Компьютер выиграл!</H2>");
            }
        });
    }
    function MouseClick(_row, _col) {
        // If asynchronous request is still executing
        if (!mouseInputAvailable)
            return;
        if (!game.Move(userPlayerNum, _row, _col))
            return;
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
                        data: { playerNum: compPlayerNum, board: game.GetBoard(), lastMoveNum: game.lastMoveNum },
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
    return {
        setters:[
            function (TicTacToeGame_js_1_1) {
                TicTacToeGame_js_1 = TicTacToeGame_js_1_1;
            },
            function (BoardHTMLRender_js_1_1) {
                BoardHTMLRender_js_1 = BoardHTMLRender_js_1_1;
            },
            function (BoardCanvasRender_js_1_1) {
                BoardCanvasRender_js_1 = BoardCanvasRender_js_1_1;
            }],
        execute: function() {
            $("input[name='NewGameButton']").on('click', NewGame);
            userPlayerNum = 1;
            compPlayerNum = 2;
            mouseInputAvailable = true;
            boardRender = new BoardCanvasRender_js_1.BoardCanvasRender($('#gameboard_div'), MouseClick, 200);
            // There is no CanvasIsSupported method in IBoardRender interface, so we need type casting
            if (!boardRender.CanvasIsSupported())
                boardRender = new BoardHTMLRender_js_1.BoardHTMLRender($('#gameboard_div'), MouseClick);
        }
    }
});

///<reference path="../typings/TicTacToeHub.d.ts" />
///<reference path="./TicTacToeGame.ts" />
///<reference path="./BoardHTMLRender.ts" />
///<reference path="./BoardCanvasRender.ts" />
System.register(["./TicTacToeGame.js", "./BoardHTMLRender.js", "./BoardCanvasRender.js"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TicTacToeGame_js_1, BoardHTMLRender_js_1, BoardCanvasRender_js_1;
    var userPlayerNum, opponentPlayerNum, mouseInputAvailable, game, gameId, boardRender, gameMode, hub;
    function JoinGameClick() {
        JoinGameDialog(JoinGame);
    }
    function JoinGame(gameId) {
        if (!gameId || gameId.length === 0) {
            msg("Невозможно присоединиться к игре: не заполнен game ID");
            return;
        }
        $.ajax({
            type: 'POST',
            data: { GameId: gameId },
            url: "http://" + window.location.host + "/TicTacToe/JoinGame",
            success: function (data) {
                if (data["isOk"]) {
                    if (game && !game.GameIsFinished()) {
                        hub.server.send("Leave", "");
                    }
                    hub.server.send("JoinGame", gameId);
                    game = new TicTacToeGame_js_1.TicTacToeGame();
                    boardRender.winCombination = [];
                    userPlayerNum = data["playerNum"];
                    opponentPlayerNum = (userPlayerNum == 1 ? 2 : 1);
                    boardRender.DrawBoard(game.GetBoard());
                    mouseInputAvailable = (userPlayerNum == 1 ? true : false);
                    var message = "<p>Вы присоединились к игре:</p>";
                    message = message + "<p>Вы играете: " + (userPlayerNum == 1 ? "Крестиками" : "Ноликами") + "</p>";
                    message = message + "<p>Ваш противник играет: " + (userPlayerNum == 1 ? "Ноликами" : "Крестиками") + "</p>";
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
        if (game && !game.GameIsFinished()) {
            hub.server.send("Leave", "");
        }
        if (userPlayerNum == 2) {
            mouseInputAvailable = false; // mouse input on the game board is not allowed
            opponentPlayerNum = 1;
        }
        else
            opponentPlayerNum = 2;
        $.ajax({
            type: 'POST',
            data: { GameMode: gameMode, playerNum: userPlayerNum },
            url: "http://" + window.location.host + "/TicTacToe/NewGame",
            success: function (data) {
                if (data["isOk"]) {
                    $("#gameinfo_div").html("");
                    game = new TicTacToeGame_js_1.TicTacToeGame();
                    boardRender.winCombination = [];
                    if (gameMode == TicTacToeGame_js_1.GameMode.WithComputer && userPlayerNum == 2) {
                        $.ajax({
                            type: 'POST',
                            data: { playerNum: opponentPlayerNum, board: game.GetBoard(), lastMoveNum: game.lastMoveNum },
                            url: "http://" + window.location.host + "/TicTacToe/ComputerMove",
                            success: function (data) {
                                if (data["isOk"]) {
                                    game.Move(opponentPlayerNum, data['row'], data['col']);
                                    if (game.GameIsFinished()) {
                                        if (game.winner != 0)
                                            boardRender.winCombination = game.winCombination;
                                        boardRender.DrawBoard(game.GetBoard());
                                        AfterFinishingGame(game.winner);
                                    }
                                    else
                                        boardRender.DrawBoard(game.GetBoard());
                                }
                                mouseInputAvailable = true;
                                return;
                            }
                        });
                    }
                    else if (gameMode == TicTacToeGame_js_1.GameMode.WithUser) {
                        gameId = data["gameId"];
                        $("input[name='InviteButton']").prop('disabled', false);
                        mouseInputAvailable = false;
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
                    $("#gameinfo_div").html("<H2>Вы выиграли!</H2>");
                else if (winner == opponentPlayerNum) {
                    if (gameMode == TicTacToeGame_js_1.GameMode.WithComputer)
                        $("#gameinfo_div").html("<H2>Компьютер выиграл!</H2>");
                    else
                        $("#gameinfo_div").html("<H2>Выиграл игрок №" + opponentPlayerNum + "!</H2>");
                }
                else
                    $("#gameinfo_div").html("<H2>Ничья!</H2>");
            }
        });
    }
    function MouseClick(_row, _col) {
        // If asynchronous request is still executing
        if (!mouseInputAvailable)
            return;
        if (!game.Move(userPlayerNum, _row, _col))
            return;
        if (game.winner != 0)
            boardRender.winCombination = game.winCombination;
        boardRender.DrawBoard(game.GetBoard());
        $.ajax({
            type: 'POST',
            data: { col: _col, row: _row, lastMoveNum: game.lastMoveNum },
            url: "http://" + window.location.host + "/TicTacToe/UserMove",
            success: function (data) {
                hub.server.send("UserMove", JSON.stringify(new TicTacToeGame_js_1.Cell(_row, _col)));
                if (game.GameIsFinished()) {
                    AfterFinishingGame(game.winner);
                }
                else if (gameMode == TicTacToeGame_js_1.GameMode.WithComputer) {
                    $.ajax({
                        type: 'POST',
                        data: { playerNum: opponentPlayerNum, board: game.GetBoard(), lastMoveNum: game.lastMoveNum },
                        url: "http://" + window.location.host + "/TicTacToe/ComputerMove",
                        success: function (data) {
                            if (data["isOk"]) {
                                game.Move(opponentPlayerNum, data['row'], data['col']);
                                if (game.GameIsFinished()) {
                                    if (game.winner != 0)
                                        boardRender.winCombination = game.winCombination;
                                    boardRender.DrawBoard(game.GetBoard());
                                    AfterFinishingGame(game.winner);
                                }
                                else
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
    function InviteClick() {
        //window.prompt("Отправьте идентификатор игры, другому игроку,чтобы он мог присоединиться:", gameId);    
        var dlgContainer;
        dlgContainer = $("#InviteDialog");
        if (dlgContainer.length == 0) {
            dlgContainer = $(document.createElement("div"));
            dlgContainer.attr("id", "InviteDialog");
            dlgContainer.append("<p>Отправьте идентификатор игры, другому игроку,чтобы он мог присоединиться:</p>");
            dlgContainer.append("<input onClick='this.setSelectionRange(0, this.value.length)' type = 'text' value='" + gameId + "'>");
            (dlgContainer.find("input").get(0)).setSelectionRange(0, gameId.toString().length);
            dlgContainer.append("<input type = 'button' value='Копировать в буфер' style='margin: 10px 10px 10px 10px;'>");
            dlgContainer.find("input[type='button']").on('click', CopyBuffer);
            document.body.appendChild(dlgContainer.get(0));
        }
        else {
            var text = dlgContainer.find("input");
            text.val(gameId);
            (text.get(0)).setSelectionRange(0, gameId.toString().length);
        }
        function CopyBuffer() {
            (dlgContainer.find("input").get(0)).setSelectionRange(0, gameId.toString().length);
            var error = false;
            try {
                var successful = document.execCommand('copy');
                if (!successful)
                    msg("Не удалось скопировать Game ID в буфер обмена");
            }
            catch (err) {
                msg("Не удалось скопировать Game ID в буфер обмена");
            }
            if (error)
                msg("Не удалось скопировать Game ID в буфер обмена");
            else
                dlgContainer.dialog("destroy").remove();
        }
        dlgContainer.dialog({
            width: "40%",
            title: "Пригласить партнера в игру"
        });
    }
    function JoinGameDialog(JoinGameClickHandler) {
        var dlgContainer;
        function JoinGameClick() {
            var gameId = dlgContainer.find("input[name='GameID']").val();
            if (!gameId || gameId.length === 0) {
                msg("Невозможно присоединиться к игре: не заполнен game ID");
                return;
            }
            JoinGameClickHandler(gameId);
            dlgContainer.find("input[type='button']").off('click');
            dlgContainer.dialog("destroy").remove();
        }
        dlgContainer = $("#JoinGameDialog");
        if (dlgContainer.length == 0) {
            dlgContainer = $(document.createElement("div"));
            dlgContainer.attr("id", "JoinGameDialog");
            dlgContainer.append("Game ID: <input type = 'text' name = 'GameID'>");
            dlgContainer.append("<input type = 'button' value='Присоединиться к игре' style='margin: 10px 10px 10px 10px;'>");
            dlgContainer.find("input[type='button']").on('click', JoinGameClick);
            document.body.appendChild(dlgContainer.get(0));
        }
        dlgContainer.dialog({
            width: "40%",
            title: "Присоединение к игре"
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
            $("input[name='JoinGameButton']").on('click', JoinGameClick);
            $("input[name='InviteButton']").on('click', InviteClick);
            userPlayerNum = 1;
            opponentPlayerNum = 2;
            mouseInputAvailable = true;
            $(function () {
                hub = $.connection.ticTacToeHub;
                hub.client.broadcastMessage = function (command, commandParams) {
                    if (command == "JoinGame") {
                        mouseInputAvailable = (userPlayerNum == 1 ? true : false);
                        var msg = "<p>Другой игрок присоединился к игре:</p>";
                        msg = msg + "<p>Вы играете: " + (userPlayerNum == 1 ? "Крестиками" : "Ноликами") + "</p>";
                        msg = msg + "<p>Ваш противник играет: " + (userPlayerNum == 1 ? "Ноликами" : "Крестиками") + "</p>";
                        $("#gameinfo_div").html(msg);
                    }
                    else if (command == "UserMove") {
                        mouseInputAvailable = true;
                        var cell = JSON.parse(commandParams);
                        if (game.Move(opponentPlayerNum, cell.row, cell.col)) {
                            if (game.winner != 0)
                                boardRender.winCombination = game.winCombination;
                            boardRender.DrawBoard(game.GetBoard());
                        }
                        if (game.GameIsFinished()) {
                            AfterFinishingGame(game.winner);
                            mouseInputAvailable = false;
                            ;
                        }
                    }
                    else if (command == "Leave") {
                        $("#gameinfo_div").html("<H4>Ваш противник покинул игру</H4>");
                    }
                };
                $.connection.hub.start();
            });
            boardRender = new BoardCanvasRender_js_1.BoardCanvasRender($('#gameboard_div'), MouseClick, 200);
            // There is no CanvasIsSupported method in IBoardRender interface, so we need type casting
            if (!boardRender.CanvasIsSupported())
                boardRender = new BoardHTMLRender_js_1.BoardHTMLRender($('#gameboard_div'), MouseClick);
        }
    }
});

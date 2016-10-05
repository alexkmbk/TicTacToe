///<reference path="../lib/jquery/jquery.d.ts" />
System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var BoardCanvasRender;
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    return {
        setters:[],
        execute: function() {
            BoardCanvasRender = (function () {
                function BoardCanvasRender(element, cellClickHandler, width) {
                    var _this = this;
                    this.MouseClick = function (event) {
                        var mousePos = getMousePos(_this.canvasElement, event);
                        var col = 0;
                        var row = 0;
                        if (mousePos.x < _this.cellWidth)
                            col = 0;
                        else if (mousePos.x < _this.cellWidth * 2)
                            col = 1;
                        else
                            col = 2;
                        if (mousePos.y < _this.cellWidth)
                            row = 0;
                        else if (mousePos.y < _this.cellWidth * 2)
                            row = 1;
                        else
                            row = 2;
                        _this.cellClickHandler(row, col);
                    };
                    this.element = element;
                    this.cellClickHandler = cellClickHandler;
                    this.element.html('<canvas name="board" width="' + width + '" height="' + width + '"></canvas>');
                    this.canvas = this.element.find('canvas');
                    this.canvasElement = this.canvas.get(0);
                    this.ctx = this.canvasElement.getContext('2d');
                    this.width = width;
                    this.cellWidth = (width / 3);
                    this.element.on('click', function (event) { return _this.MouseClick(event); });
                }
                BoardCanvasRender.prototype.CanvasIsSupported = function () {
                    if (this.canvasElement.getContext)
                        return true;
                    else
                        return false;
                };
                BoardCanvasRender.prototype.DrawBoard = function (board) {
                    var ctx = this.ctx;
                    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
                    ctx.lineWidth = BoardCanvasRender.lineWidth;
                    ctx.beginPath();
                    ctx.moveTo(this.cellWidth, 0);
                    ctx.lineTo(this.cellWidth, this.width);
                    ctx.moveTo(this.cellWidth * 2, 0);
                    ctx.lineTo(this.cellWidth * 2, this.width);
                    ctx.moveTo(0, this.cellWidth);
                    ctx.lineTo(this.cellWidth * 3, this.cellWidth);
                    ctx.moveTo(0, this.cellWidth * 2);
                    ctx.lineTo(this.cellWidth * 3, this.cellWidth * 2);
                    ctx.strokeStyle = 'green';
                    ctx.stroke();
                    ctx.closePath();
                    for (var row = 0; row < 3; row++) {
                        for (var col = 0; col < 3; col++) {
                            var val = board[row][col];
                            if (val == 0) {
                                this.DrawO(row, col);
                            }
                            else if (val == 1) {
                                this.DrawX(row, col);
                            }
                        }
                    }
                };
                BoardCanvasRender.prototype.DrawX = function (row, col) {
                    var ctx = this.ctx;
                    ctx.beginPath();
                    ctx.strokeStyle = 'blue';
                    var LeftTopX = col * this.cellWidth;
                    var LeftTopY = row * this.cellWidth;
                    var pad = BoardCanvasRender.figurePadding;
                    ctx.moveTo(LeftTopX + pad, LeftTopY + pad);
                    ctx.lineTo(LeftTopX + this.cellWidth - pad, LeftTopY + this.cellWidth - pad);
                    ctx.moveTo(LeftTopX + pad, LeftTopY + this.cellWidth - pad);
                    ctx.lineTo(LeftTopX + this.cellWidth - pad, LeftTopY + pad);
                    ctx.stroke();
                    ctx.closePath();
                };
                BoardCanvasRender.prototype.DrawO = function (row, col) {
                    var ctx = this.ctx;
                    ctx.beginPath();
                    ctx.strokeStyle = 'blue';
                    var LeftTopX = col * this.cellWidth;
                    var LeftTopY = row * this.cellWidth;
                    var pad = BoardCanvasRender.figurePadding;
                    ctx.arc(LeftTopX + this.cellWidth / 2, LeftTopY + this.cellWidth / 2, (this.cellWidth / 2) - pad, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                };
                BoardCanvasRender.lineWidth = 4;
                BoardCanvasRender.figurePadding = 16;
                return BoardCanvasRender;
            }());
            exports_1("BoardCanvasRender", BoardCanvasRender);
        }
    }
});

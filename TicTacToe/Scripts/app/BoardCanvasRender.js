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
                    this.ratio = 1;
                    this.MouseClick = function (event) {
                        var cellWidth = _this.cellWidth * _this.ratio;
                        var mousePos = getMousePos(_this.canvasElement, event);
                        var col = 0;
                        var row = 0;
                        if (mousePos.x < cellWidth)
                            col = 0;
                        else if (mousePos.x < cellWidth * 2)
                            col = 1;
                        else
                            col = 2;
                        if (mousePos.y < cellWidth)
                            row = 0;
                        else if (mousePos.y < cellWidth * 2)
                            row = 1;
                        else
                            row = 2;
                        _this.cellClickHandler(row, col);
                    };
                    this.Resize = function (event) {
                        var height = _this.canvasElement.height;
                        var width = _this.canvasElement.width;
                        var rect = _this.canvasElement.getBoundingClientRect();
                        if (rect.top < 0)
                            height = _this.canvasElement.height + rect.top;
                        else if (rect.bottom > window.innerHeight)
                            height = _this.canvasElement.height - (rect.bottom - window.innerHeight);
                        else if (_this.canvasElement.height < _this.width && rect.bottom < window.innerHeight)
                            height = Math.min(_this.width, window.innerHeight);
                        if (rect.left < 0)
                            width = _this.canvasElement.width + rect.left;
                        else if (rect.right > window.innerWidth)
                            width = _this.canvasElement.width - (rect.right - window.innerWidth);
                        else if (_this.canvasElement.width < _this.width && rect.right < window.innerWidth)
                            width = Math.min(_this.width, window.innerWidth);
                        width = Math.min(height, width);
                        _this.canvasElement.height = width;
                        _this.canvasElement.width = width;
                        _this.ratio = width / _this.width;
                        _this.DrawBoard(_this.board);
                    };
                    this.element = element;
                    this.cellClickHandler = cellClickHandler;
                    this.width = width; //Math.min(width, window.innerWidth, window.innerHeight);
                    this.cellWidth = (this.width / 3);
                    this.element.html('<canvas name="board" width="' + this.width + '" height="' + this.width + '"></canvas>');
                    this.canvas = this.element.find('canvas');
                    this.canvasElement = this.canvas.get(0);
                    this.ctx = this.canvasElement.getContext('2d');
                    this.element.on('click', function (event) { return _this.MouseClick(event); });
                    //window.addEventListener('DOMContentLoaded load resize scroll', (event) => this.Resize(event));
                    window.addEventListener('resize', function (event) { return _this.Resize(event); });
                }
                BoardCanvasRender.prototype.CanvasIsSupported = function () {
                    if (this.canvasElement.getContext)
                        return true;
                    else
                        return false;
                };
                BoardCanvasRender.prototype.DrawBoard = function (board) {
                    this.board = board;
                    var ctx = this.ctx;
                    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
                    var cellWidth = this.cellWidth * this.ratio;
                    ctx.lineWidth = BoardCanvasRender.lineWidth * this.ratio;
                    ctx.beginPath();
                    ctx.moveTo(cellWidth, 0);
                    ctx.lineTo(cellWidth, this.width);
                    ctx.moveTo(cellWidth * 2, 0);
                    ctx.lineTo(cellWidth * 2, this.width);
                    ctx.moveTo(0, cellWidth);
                    ctx.lineTo(cellWidth * 3, cellWidth);
                    ctx.moveTo(0, cellWidth * 2);
                    ctx.lineTo(cellWidth * 3, cellWidth * 2);
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
                    var pad = BoardCanvasRender.figurePadding * this.ratio;
                    var cellWidth = this.cellWidth * this.ratio;
                    var LeftTopX = col * cellWidth;
                    var LeftTopY = row * cellWidth;
                    ctx.moveTo(LeftTopX + pad, LeftTopY + pad);
                    ctx.lineTo(LeftTopX + cellWidth - pad, LeftTopY + cellWidth - pad);
                    ctx.moveTo(LeftTopX + pad, LeftTopY + cellWidth - pad);
                    ctx.lineTo(LeftTopX + cellWidth - pad, LeftTopY + pad);
                    ctx.stroke();
                    ctx.closePath();
                };
                BoardCanvasRender.prototype.DrawO = function (row, col) {
                    var ctx = this.ctx;
                    ctx.beginPath();
                    ctx.strokeStyle = 'blue';
                    var pad = BoardCanvasRender.figurePadding * this.ratio;
                    var cellWidth = this.cellWidth * this.ratio;
                    var LeftTopX = col * cellWidth;
                    var LeftTopY = row * cellWidth;
                    ctx.arc(LeftTopX + cellWidth / 2, LeftTopY + cellWidth / 2, (cellWidth / 2) - pad, 0, 2 * Math.PI);
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

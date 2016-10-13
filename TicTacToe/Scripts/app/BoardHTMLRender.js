System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var BoardHTMLRender;
    return {
        setters:[],
        execute: function() {
            BoardHTMLRender = (function () {
                function BoardHTMLRender(element, cellClickHandler) {
                    var _this = this;
                    this.MouseClick = function (event) {
                        var target = $(event.target);
                        var col = target.index();
                        var row = target.parent().index();
                        _this.cellClickHandler(row, col);
                    };
                    this.element = element;
                    this.cellClickHandler = cellClickHandler;
                    this.element.on('click', 'td', function (event) { return _this.MouseClick(event); });
                    this.winCombination = [];
                }
                BoardHTMLRender.prototype.DrawBoard = function (board) {
                    var html = "<table class='table table-striped table-bordered table-condensed' style='width:200px'>";
                    for (var i = 0; i < 3; i++) {
                        html = html + "<tr>";
                        for (var j = 0; j < 3; j++) {
                            html = html + "<td>";
                            var val = board[i][j];
                            if (val == 0) {
                                html = html + "<img src='http://" + window.location.host + "/Content/o.png'>";
                            }
                            else if (val == 1) {
                                html = html + "<img src='http://" + window.location.host + "/Content/x.png'>";
                            }
                            html = html + "</td>";
                        }
                        html = html + "</tr>";
                    }
                    html = html + "</table>";
                    this.element.html(html);
                };
                BoardHTMLRender.prototype.DrawCrossingLine = function (comb) {
                    // the method is not implemented yet
                };
                return BoardHTMLRender;
            }());
            exports_1("BoardHTMLRender", BoardHTMLRender);
        }
    }
});

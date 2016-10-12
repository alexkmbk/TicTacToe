import { IBoardRender } from "./IBoardRender.js";

export class BoardHTMLRender implements IBoardRender {
    element: JQuery;
    cellClickHandler: Function;
    constructor(element: JQuery, cellClickHandler: Function) {
        this.element = element;
        this.cellClickHandler = cellClickHandler;
        this.element.on('click', 'td', (event) => this.MouseClick(event));

    }
    public DrawBoard(board: number[][]) {
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
    }

    MouseClick = (event: JQueryEventObject) => {
        var target = $(event.target);
        var col = target.index();
        var row = target.parent().index();
        this.cellClickHandler(row, col);
    }
}
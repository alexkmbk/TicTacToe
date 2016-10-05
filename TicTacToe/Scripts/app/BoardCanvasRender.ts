///<reference path="../lib/jquery/jquery.d.ts" />

import { IBoardRender } from "./IBoardRender.js";

export class BoardCanvasRender implements  IBoardRender {
    element: JQuery;
    canvas: JQuery;
    canvasElement: HTMLCanvasElement;
    cellClickHandler: Function;
    ctx: CanvasRenderingContext2D;
    width: number;
    cellWidth: number;
    public static lineWidth: number = 4;
    public static figurePadding: number = 16;

    constructor(element: JQuery, cellClickHandler: Function, width: number) {
        this.element = element;
        this.cellClickHandler = cellClickHandler;
        this.element.html('<canvas name="board" width="' + width + '" height="' + width + '"></canvas>');
        this.canvas = this.element.find('canvas');
        this.canvasElement = <HTMLCanvasElement>this.canvas.get(0);
        this.ctx = this.canvasElement.getContext('2d');
        this.width = width;
        this.cellWidth = (width / 3);

        this.element.on('click', (event) => this.MouseClick(event));

    }
    public CanvasIsSupported(): boolean{
        if (this.canvasElement.getContext)
            return true;
        else 
            return false;
    }
    public DrawBoard(board: number[][]) {

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

    }

    DrawX(row: number, col: number) {
        var ctx = this.ctx;

        ctx.beginPath();
        ctx.strokeStyle = 'blue';

        var LeftTopX: number = col * this.cellWidth;
        var LeftTopY: number = row * this.cellWidth;
        var pad = BoardCanvasRender.figurePadding;

        ctx.moveTo(LeftTopX + pad, LeftTopY + pad);
        ctx.lineTo(LeftTopX + this.cellWidth - pad, LeftTopY + this.cellWidth - pad);

        ctx.moveTo(LeftTopX + pad, LeftTopY + this.cellWidth - pad);
        ctx.lineTo(LeftTopX + this.cellWidth - pad, LeftTopY + pad);

        ctx.stroke();
        ctx.closePath();

    }

    DrawO(row: number, col: number) {
        var ctx = this.ctx;

        ctx.beginPath();
        ctx.strokeStyle = 'blue';

        var LeftTopX: number = col * this.cellWidth;
        var LeftTopY: number = row * this.cellWidth;
        var pad = BoardCanvasRender.figurePadding;

        ctx.arc(LeftTopX + this.cellWidth / 2, LeftTopY + this.cellWidth / 2, (this.cellWidth / 2) - pad, 0, 2 * Math.PI); 

        ctx.stroke();
        ctx.closePath();

    }

    MouseClick = (event: any) => {
        var mousePos = getMousePos(this.canvasElement, event);
        var col = 0;
        var row = 0;
        if (mousePos.x < this.cellWidth)
            col = 0;
        else if (mousePos.x < this.cellWidth * 2)
            col = 1;
        else
            col = 2;

        if (mousePos.y < this.cellWidth)
            row = 0;
        else if (mousePos.y < this.cellWidth * 2)
            row = 1;
        else
            row = 2;
        this.cellClickHandler(row, col);
    }
}

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
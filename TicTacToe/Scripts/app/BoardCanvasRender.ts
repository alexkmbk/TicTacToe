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

    ratio: number = 1;
    board: number[][];

    constructor(element: JQuery, cellClickHandler: Function, width: number) {
        this.element = element;
        this.cellClickHandler = cellClickHandler;
        this.width = width;//Math.min(width, window.innerWidth, window.innerHeight);
        this.cellWidth = (this.width / 3);
        this.element.html('<canvas name="board" width="' + this.width + '" height="' + this.width + '"></canvas>');
        this.canvas = this.element.find('canvas');
        this.canvasElement = <HTMLCanvasElement>this.canvas.get(0);
        this.ctx = this.canvasElement.getContext('2d');

        this.element.on('click', (event) => this.MouseClick(event));
        window.addEventListener('resize', (event) => this.Resize(event));
    }
    public CanvasIsSupported(): boolean{
        if (this.canvasElement.getContext)
            return true;
        else 
            return false;
    }
    public DrawBoard(board: number[][]) {

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

    }

    DrawX(row: number, col: number) {
        var ctx = this.ctx;

        ctx.beginPath();
        ctx.strokeStyle = 'blue';

        var pad = BoardCanvasRender.figurePadding * this.ratio;
        var cellWidth = this.cellWidth * this.ratio;

        var LeftTopX: number = col * cellWidth;
        var LeftTopY: number = row * cellWidth;

        ctx.moveTo(LeftTopX + pad, LeftTopY + pad);
        ctx.lineTo(LeftTopX + cellWidth - pad, LeftTopY +cellWidth - pad);

        ctx.moveTo(LeftTopX + pad, LeftTopY + cellWidth - pad);
        ctx.lineTo(LeftTopX + cellWidth - pad, LeftTopY + pad);

        ctx.stroke();
        ctx.closePath();

    }

    DrawO(row: number, col: number) {
        var ctx = this.ctx;

        ctx.beginPath();
        ctx.strokeStyle = 'blue';

        var pad = BoardCanvasRender.figurePadding * this.ratio;
        var cellWidth = this.cellWidth * this.ratio;
         
        var LeftTopX: number = col * cellWidth;
        var LeftTopY: number = row * cellWidth;

        ctx.arc(LeftTopX + cellWidth / 2, LeftTopY + cellWidth / 2, (cellWidth / 2) - pad, 0, 2 * Math.PI); 

        ctx.stroke();
        ctx.closePath();

    }

    MouseClick = (event: any) => {

        var cellWidth = this.cellWidth * this.ratio;

        var mousePos = getMousePos(this.canvasElement, event);
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
        this.cellClickHandler(row, col);
    }

    Resize = (event: any) => {
        var height = this.canvasElement.height;
        var width = this.canvasElement.width;

        var rect = this.canvasElement.getBoundingClientRect();
        if (rect.top < 0)
            height = this.canvasElement.height + rect.top;
        else if (rect.bottom > window.innerHeight) 
            height = this.canvasElement.height - (rect.bottom - window.innerHeight);
        else if (this.canvasElement.height < this.width && rect.bottom < window.innerHeight)
            height = Math.min(this.width, window.innerHeight);

        if (rect.left < 0)
            width = this.canvasElement.width + rect.left;
        else if (rect.right > window.innerWidth)
            width = this.canvasElement.width - (rect.right - window.innerWidth);
        else if (this.canvasElement.width < this.width && rect.right < window.innerWidth)
            width = Math.min(this.width, window.innerWidth);

        width = Math.min(height, width);


        this.canvasElement.height = width;
        this.canvasElement.width = width;
        this.ratio = width / this.width;
        if (this.board)
            this.DrawBoard(this.board);

    }
}

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
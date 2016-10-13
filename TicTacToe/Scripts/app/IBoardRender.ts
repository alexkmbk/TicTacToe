import { Cell } from "./TicTacToeGame.js";

export interface IBoardRender {
    winCombination: Cell[];
    DrawBoard(board: number[][]);
}
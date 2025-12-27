import type WebSocket from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, GAME_START, MOVE } from "./messages.js";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private startTime: Date;
    private movesCount: number;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.movesCount = 0;
        this.startTime = new Date();

        const turn = this.board.turn()

        this.player1.send(JSON.stringify({
            type: GAME_START,
            payload: {
                color: "white",
                turn
            }
        }))

        this.player2.send(JSON.stringify({
            type: GAME_START,
            payload: {
                color: "black",
                turn
            }
        }))
    }

    makeMove(socket: WebSocket, move: { from: string; to: string }) {
        const turn = this.board.turn();

        if (turn === "w" && socket !== this.player1) return;
        if (turn === "b" && socket !== this.player2) return;

        try {
            this.board.move(move)
        } catch (error) {
            console.log(`Invalid move:${error}`)
        }



        this.player1.send(JSON.stringify({
            type: MOVE,
            payload: {
                move,
                turn: this.board.turn() === "w" ? "white" : "black"
            }
        }));

        this.player2.send(JSON.stringify({
            type: MOVE,
            payload: {
                move,
                turn: this.board.turn() === "w" ? "white" : "black"
            }
        }));

        if (this.board.isCheckmate()) {
            const winner = this.board.turn() === "w" ? "black" : "white";

            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner, reason: "checkmate" }
            }));

            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner, reason: "checkmate" }
            }));
            return;
        }

        if (this.board.isDraw()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner: null, reason: "draw" }
            }));

            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner: null, reason: "draw" }
            }));
            return;
        }

        if (this.board.isCheck()) {
            const inCheck = this.board.turn() === "w" ? "white" : "black";

            this.player1.send(JSON.stringify({
                type: "CHECK",
                payload: { color: inCheck }
            }));

            this.player2.send(JSON.stringify({
                type: "CHECK",
                payload: { color: inCheck }
            }));
        }
    }
}
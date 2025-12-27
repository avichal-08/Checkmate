import type WebSocket from "ws";
import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";

export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];
    private socketToGame = new Map<WebSocket, Game>();

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {

    }

    private handleMessage() {

    }

    private addHandler(socket: WebSocket) {

        socket.on("message", (data) => {
            const msg = JSON.parse(data.toString());

            if (msg.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.socketToGame.set(this.pendingUser, game);
                    this.socketToGame.set(socket, game);
                    this.pendingUser = null;
                } else {
                    this.pendingUser = socket;
                }
            }

            if (msg.type === MOVE) {
                const game = this.socketToGame.get(socket);
                if (game) {
                    game.makeMove(socket, msg.payload.move);
                }
            }
        })

    }
}
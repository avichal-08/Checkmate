import ChessBoard from "../components/ChessBoard";
import { useEffect, useState, useRef } from "react";
import { useSocket } from "../hooks/useSocket";
import { Chess } from "chess.js";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const GAME_START = "game_start";
export const CHECK = "CHECK";

export default function Game() {
    const socket = useSocket();
    const chessRef = useRef(new Chess());

    const [board, setBoard] = useState(chessRef.current.board());
    const [started, setStarted] = useState(false);
    const [searching, setSearching] = useState(false);
    const [myColor, setMyColor] = useState<"white" | "black" | "">("");

    const [check, setCheck] = useState<"white" | "black" | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState<"white" | "black" | null>(null);
    const [reason, setReason] = useState<"checkmate" | "draw" | null>(null);
    const [turn, setTurn] = useState<"white" | "black" | null>(null);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            switch (msg.type) {
                case GAME_START:
                    chessRef.current = new Chess();
                    setBoard(chessRef.current.board());
                    setMyColor(msg.payload.color);
                    setStarted(true);
                    setSearching(false);
                    setCheck(null);
                    setGameOver(false);
                    setTurn(msg.payload.turn);
                    break;

                case MOVE:
                    chessRef.current.move(msg.payload.move);
                    setBoard(chessRef.current.board());
                    setTurn(msg.payload.turn);
                    setCheck(null);
                    break;

                case CHECK:
                    setCheck(msg.payload.color);
                    break;

                case GAME_OVER:
                    setGameOver(true);
                    setWinner(msg.payload.winner);
                    setReason(msg.payload.reason);
                    break;
            }
        };
    }, [socket]);

    if (!socket) {
        return (
            <div className="min-h-screen bg-neutral-950 text-white text-4xl text-center pt-40">
                Connecting...
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full bg-neutral-950 text-white flex flex-col lg:flex-row">

            {gameOver && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="rounded-2xl bg-neutral-900 p-8 text-center space-y-4">
                        {winner ? (
                            <h2 className="text-3xl font-bold">
                                {winner.toUpperCase()} WINS!!
                            </h2>
                        ) : (
                            <h2 className="text-3xl font-bold">DRAW</h2>
                        )}
                        <p className="text-gray-400">{reason}</p>
                    </div>
                </div>
            )}

            <div className="flex flex-1 items-center justify-center p-4">
                {started && (
                    <div className="w-full max-w-130 aspect-square">
                        <ChessBoard board={board} socket={socket} myColor={myColor} />
                    </div>
                )}

                {searching && !started && (
                    <div className="text-xl">Searching opponent…</div>
                )}

                {!searching && !started && (
                    <div className="text-xl">Click Play to start</div>
                )}
            </div>

            <div className="w-full lg:w-95 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between p-6">

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Live Match</h2>

                    {started && (
                        <div className="rounded-xl bg-white/10 p-4">
                            <p className="text-sm text-gray-400">Your Color</p>
                            <p className="text-2xl font-semibold">{myColor}</p>
                        </div>
                    )}

                    {check && (
                        <div className="rounded-xl bg-red-500/20 p-4">
                            <p className="text-lg font-semibold text-red-400">
                                {check.toUpperCase()} is in CHECK!
                            </p>
                        </div>
                    )}

                    {started && !gameOver && (
                        <div className="rounded-xl bg-white/5 p-4">
                            <p className="text-sm text-gray-400">Status</p>
                            <p className="text-lg font-semibold text-green-400">
                                In Progress
                            </p>
                        </div>
                    )}
                    {started && !gameOver && (
                        <div className="rounded-xl bg-white/5 p-4">
                            <p className="text-sm text-gray-400">Turn</p>
                            <p className="text-lg font-semibold text-green-400">
                                {turn}
                            </p>
                        </div>
                    )}

                </div>

                <div className="mt-6 flex flex-col gap-3">
                    {!started && (
                        <button
                            onClick={() => {
                                setSearching(true);
                                socket.send(JSON.stringify({ type: INIT_GAME }));
                            }}
                            className="w-full rounded-xl bg-green-600 py-3 text-lg font-semibold cursor-pointer hover:bg-green-700 active:scale-95"
                        >
                            Play
                        </button>
                    )}

                    {started && (
                        <button
                            className="w-full rounded-xl border border-white/20 py-3 text-lg font-semibold cursor-pointer hover:bg-white/10 active:scale-95"
                        >
                            Resign
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

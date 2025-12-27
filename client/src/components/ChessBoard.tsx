import type { Color, PieceSymbol, Square } from "chess.js";
import { useRef } from "react";
import { MOVE } from "../pages/game";

const ChessBoard = ({ board, socket, myColor }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    myColor: String;
}) => {

    const fromRef = useRef<Square | null>(null);
    const toRef = useRef<Square | null>(null);

    return (
        <div className="text-white-200">
            {board.map((row, i) => {
                return <div key={i} className="flex">
                    {row.map((square, j) => {
                        const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                        return <div onClick={() => {
                            if (!fromRef.current) {
                                if (!square) return;
                                if (!square || square.color !== myColor[0]) return;
                                fromRef.current = squareRepresentation
                            } else {
                                toRef.current = squareRepresentation;
                                if (square && square.color === myColor[0]) {
                                    fromRef.current = squareRepresentation;
                                    return;
                                }
                                socket.send(JSON.stringify({
                                    type: MOVE,
                                    payload: {
                                        move: {
                                            from: fromRef.current,
                                            to: toRef.current
                                        }
                                    }
                                }))

                                fromRef.current = null;
                            }
                        }} key={i} className={`w-16 h-16 active:scale-90 active:border-2 ${(i + j) % 2 === 0 ? 'bg-green-500' : 'bg-white'}`}>
                            <div className="flex justify-center h-full">
                                <div className="flex items-center">
                                    {square ? <img className="w-8" src={`./${square.color === "b" ? square.type : `${square.type.toUpperCase() + "w"}`}.png`} /> : null}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}

export default ChessBoard;
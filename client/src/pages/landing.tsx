import chessImg from "../../assets/chess.jpeg";
import { useNavigate } from "react-router-dom";

export default function Landing() {

    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-neutral-950 text-white">

            <img
                src={chessImg}
                alt="Chess background"
                className="absolute inset-0 h-full w-full object-cover scale-100 opacity-30"
            />

            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/90" />

            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">

                <span className="mb-4 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-sm text-gray-300 backdrop-blur">
                    ♟️ Real-time Multiplayer Chess
                </span>

                <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                    Outsmart Real Players.
                    <br />
                    <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        Every Single Move.
                    </span>
                </h1>

                <p className="mt-6 max-w-xl text-base text-gray-300 sm:text-lg">
                    No ads. No noise. Just pure competitive chess with real players,
                    real-time moves, and zero distractions.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <button onClick={() => navigate("/game")} className="rounded-xl bg-green-600 px-8 py-4 text-lg font-semibold cursor-pointer shadow-lg transition-all hover:bg-green-700 hover:shadow-green-600/30 active:scale-95">
                        Play Online
                    </button>

                    <button className="rounded-xl border border-white/20 cursor-pointer bg-white/5 px-8 py-4 text-lg font-semibold backdrop-blur transition-all hover:bg-white/10 active:scale-95">
                        Play vs AI
                    </button>
                </div>

                <p className="mt-10 text-sm text-gray-400">
                    World’s #18 chess platform (bcoz 18 is love)
                </p>
            </div>
        </div>
    );
}

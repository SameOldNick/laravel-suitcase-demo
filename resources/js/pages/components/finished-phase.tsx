import { Item, ITEMS } from "@/data/suitcase-items";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { MAX_STRIKES } from "../constants";

interface FinishedPhaseProps {
    score: number;
    packed: number;
    caught: number;
    best: number;
    newBest: boolean;
    strikes: number;
    start: () => void;
}

const FinishedPhase = ({
    score,
    packed,
    caught,
    best,
    newBest,
    strikes,
    start,
}: FinishedPhaseProps) => {
    return (
        <>
            <div className="px-8 py-8 text-center">
                <div className="text-6xl">🛬</div>
                <h2 className="mt-4 text-2xl font-bold">
                    {strikes >= MAX_STRIKES
                        ? "Held at the border!"
                        : "Time's up!"}
                </h2>
                <p className="mt-2 text-sm text-indigo-200/80">
                    {strikes >= MAX_STRIKES
                        ? "You made too many mistakes."
                        : "You ran out of time."}
                </p>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                    {newBest && (
                        <div className="mb-1 text-xs font-bold tracking-widest text-amber-300 uppercase">
                            New high score 🏆
                        </div>
                    )}
                    <div className="text-5xl font-extrabold">{score}</div>
                    <div className="mt-1 text-xs font-medium tracking-widest text-indigo-200/70 uppercase">
                        Final score
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
                        <div>
                            <div className="text-xl font-bold">{packed}</div>
                            <div className="text-indigo-200/70">Packed</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold">{caught}</div>
                            <div className="text-indigo-200/70">Rejected</div>
                        </div>
                        <div>
                            <div className="text-xl font-bold">
                                {Math.max(best, score)}
                            </div>
                            <div className="text-indigo-200/70">Best</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={start}
                    className="mt-6 rounded-2xl bg-indigo-500 px-8 py-3.5 text-base font-bold shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 active:scale-95"
                >
                    Play again
                </button>
            </div>
        </>
    );
};

export default FinishedPhase;

import { Item, ITEMS } from "@/data/suitcase-items";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { CAPACITY, MAX_STRIKES, ROUND_TIME } from "../constants";

interface ReadyPhaseProps {
    start: () => void;
}

const ReadyPhase = ({ start }: ReadyPhaseProps) => {
    return (
        <>
            <div className="px-8 py-8 text-center">
                <div className="text-6xl">🛂</div>
                <h2 className="mt-4 text-xl font-bold">
                    Can you pack the perfect case?
                </h2>
                <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left text-sm text-indigo-100/90">
                    <li>✅ Pack items that are allowed into Canada.</li>
                    <li>
                        🚫 Reject prohibited & restricted goods — weapons,
                        cannabis, fresh food, plants.
                    </li>
                    <li>⚖️ Don't overload your {CAPACITY} kg suitcase.</li>
                    <li>
                        💥 If you make {MAX_STRIKES} mistakes, security will
                        stop you.
                    </li>
                    <li>⏱️ You have {ROUND_TIME} seconds. Go!</li>
                </ul>
                <button
                    onClick={start}
                    className="mt-7 rounded-2xl bg-indigo-500 px-8 py-3.5 text-base font-bold shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 active:scale-95"
                >
                    Start packing
                </button>
            </div>
        </>
    );
};

export default ReadyPhase;

import { Item, ITEMS } from "@/data/suitcase-items";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { CAPACITY, MAX_STRIKES } from "../constants";
import { Feedback } from "../typings";

const FEEDBACK_CLASSES: Record<Feedback["kind"], string> = {
    good: "bg-emerald-500/20 text-emerald-300",
    bad: "bg-rose-500/20 text-rose-300",
    warn: "bg-amber-500/20 text-amber-300",
};

interface PlayingPhaseProps {
    item: Item;
    score: number;
    strikes: number;
    weight: number;
    weightPercent: number;
    timeLeft: number;
    feedback?: Feedback;
    decide: (decision: "pack" | "reject") => void;
}

const PlayingPhase = ({
    item,
    score,
    strikes,
    weight,
    weightPercent,
    timeLeft,
    feedback,
    decide,
}: PlayingPhaseProps) => {
    return (
        <>
            <div className="px-6 py-6">
                <div className="grid grid-cols-4 gap-2 text-center">
                    <Stat label="Score" value={String(score)} />
                    <Stat label="Time" value={`${timeLeft}s`} />
                    <Stat
                        label="Weight"
                        value={`${weight.toFixed(1)}/${CAPACITY}kg`}
                    />
                    <div className="rounded-xl bg-white/5 px-2 py-2.5">
                        <div className="flex items-center justify-center gap-1 text-sm leading-none">
                            {Array.from({
                                length: MAX_STRIKES,
                            }).map((_, index) => (
                                <span
                                    key={index}
                                    className={
                                        index < strikes
                                            ? "text-rose-400"
                                            : "text-white/20"
                                    }
                                >
                                    ✖
                                </span>
                            ))}
                        </div>
                        <div className="mt-1 text-[10px] font-medium tracking-wider text-indigo-200/60 uppercase">
                            Strikes
                        </div>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center justify-between text-xs font-semibold text-indigo-200/70">
                        <span>🧳 Suitcase capacity</span>
                        <span>{weightPercent}%</span>
                    </div>
                    <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-300"
                            style={{ width: `${weightPercent}%` }}
                        />
                    </div>
                </div>

                <div
                    key={item.id}
                    className="mt-5 animate-[slide-in_0.35s_ease-out] rounded-2xl border border-white/10 bg-slate-900/60 p-6 text-center"
                >
                    <div className="text-6xl leading-none drop-shadow-lg">
                        {item.emoji}
                    </div>
                    <div className="mt-3 text-lg font-semibold">
                        {item.name}
                    </div>
                    <div className="mt-1 text-sm text-indigo-200/70">
                        {item.weight.toFixed(1)} kg
                    </div>
                </div>

                <div className="mt-4 min-h-10">
                    {feedback ? (
                        <div
                            className={`rounded-xl px-4 py-2 text-center text-sm font-semibold ${FEEDBACK_CLASSES[feedback.kind]}`}
                        >
                            {feedback.text}
                        </div>
                    ) : (
                        <div className="py-2 text-center text-sm text-indigo-200/50">
                            Pack it or reject it — choose fast!
                        </div>
                    )}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-3">
                    <button
                        onClick={() => decide("pack")}
                        className="rounded-2xl bg-emerald-500 px-4 py-3.5 text-base font-bold shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 active:scale-95"
                    >
                        ✓ Pack
                    </button>
                    <button
                        onClick={() => decide("reject")}
                        className="rounded-2xl bg-rose-500 px-4 py-3.5 text-base font-bold shadow-lg shadow-rose-500/30 transition hover:bg-rose-400 active:scale-95"
                    >
                        ✗ Reject
                    </button>
                </div>
            </div>
        </>
    );
};

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-white/5 px-2 py-2.5">
            <div className="text-base leading-tight font-bold">{value}</div>
            <div className="mt-1 text-[10px] font-medium tracking-wider text-indigo-200/60 uppercase">
                {label}
            </div>
        </div>
    );
}

export default PlayingPhase;

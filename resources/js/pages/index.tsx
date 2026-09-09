import { Item, ITEMS } from "@/data/suitcase-items";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

type Feedback = {
    kind: "good" | "bad" | "warn";
    text: string;
};

type Phase = "ready" | "playing" | "over";

const CAPACITY = 12;
const ROUND_TIME = 30;
const MAX_STRIKES = 3;
const HIGH_SCORE_KEY = "pack-and-pass-high-score";

const PACK_BANNED_PENALTY = 20;
const OVERPACK_PENALTY = 5;
const REJECT_SAFE_PENALTY = 5;
const GOOD_CATCH_BONUS = 15;

const FEEDBACK_CLASSES: Record<Feedback["kind"], string> = {
    good: "bg-emerald-500/20 text-emerald-300",
    bad: "bg-rose-500/20 text-rose-300",
    warn: "bg-amber-500/20 text-amber-300",
};

function randomItem(excludeId?: string): Item {
    const pool = excludeId
        ? ITEMS.filter((item) => item.id !== excludeId)
        : ITEMS;
    return pool[Math.floor(Math.random() * pool.length)];
}

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

const Home = () => {
    const [phase, setPhase] = useState<Phase>("ready");
    const [item, setItem] = useState<Item>(() => randomItem());
    const [score, setScore] = useState(0);
    const [weight, setWeight] = useState(0);
    const [strikes, setStrikes] = useState(0);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const [packed, setPacked] = useState(0);
    const [caught, setCaught] = useState(0);
    const [best, setBest] = useState(0);
    const [newBest, setNewBest] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const stored = window.localStorage.getItem(HIGH_SCORE_KEY);

        if (stored) {
            setBest(Number(stored) || 0);
        }
    }, []);

    useEffect(() => {
        if (phase !== "playing") return;

        const timer = window.setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [phase]);

    useEffect(() => {
        if (phase !== "playing") return;

        if (timeLeft <= 0 || strikes >= MAX_STRIKES) {
            setNewBest(score > best);
            setPhase("over");
        }
    }, [phase, timeLeft, strikes, score, best]);

    useEffect(() => {
        if (phase !== "over") return;

        setBest((prev) => {
            const next = Math.max(prev, score);

            if (typeof window !== "undefined") {
                window.localStorage.setItem(HIGH_SCORE_KEY, String(next));
            }

            return next;
        });
    }, [phase, score]);

    useEffect(() => {
        if (!feedback) return;

        const timer = window.setTimeout(() => setFeedback(null), 900);

        return () => window.clearTimeout(timer);
    }, [feedback]);

    const showFeedback = (kind: Feedback["kind"], text: string) => {
        setFeedback({ kind, text });
    };

    const decide = (action: "pack" | "reject") => {
        if (phase !== "playing") return;

        const current = item;

        if (action === "pack") {
            if (current.banned) {
                showFeedback(
                    "bad",
                    `${current.emoji} ${current.name} is prohibited or restricted at the border!`,
                );

                setScore((s) => s - PACK_BANNED_PENALTY);

                setStrikes((s) => s + 1);
            } else if (weight + current.weight > CAPACITY) {
                showFeedback(
                    "warn",
                    `${current.emoji} ${current.name} won't fit — you overpacked!`,
                );

                setScore((s) => s - OVERPACK_PENALTY);

                setStrikes((s) => s + 1);
            } else {
                showFeedback(
                    "good",
                    `Packed ${current.emoji} ${current.name} (+${current.value})`,
                );

                setWeight((w) => w + current.weight);

                setScore((s) => s + current.value);

                setPacked((p) => p + 1);
            }
        } else if (current.banned) {
            showFeedback(
                "good",
                `Good catch — ${current.emoji} ${current.name} rejected (+${GOOD_CATCH_BONUS})`,
            );

            setScore((s) => s + GOOD_CATCH_BONUS);

            setCaught((c) => c + 1);
        } else {
            showFeedback(
                "warn",
                `${current.emoji} ${current.name} was totally fine to pack!`,
            );

            setScore((s) => s - REJECT_SAFE_PENALTY);

            setStrikes((s) => s + 1);
        }

        setItem(randomItem(current.id));
    };

    const start = () => {
        setScore(0);
        setWeight(0);
        setStrikes(0);
        setTimeLeft(ROUND_TIME);
        setPacked(0);
        setCaught(0);
        setNewBest(false);
        setFeedback(null);
        setItem(randomItem());
        setPhase("playing");
    };

    const weightPercent = Math.min(100, Math.round((weight / CAPACITY) * 100));

    return (
        <>
            <Head title="Pack & Pass" />
            <style>{`@keyframes slide-in { from { transform: translateY(10px) scale(0.95); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }`}</style>

            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 font-sans text-white">
                <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
                    <div className="border-b border-white/10 px-8 pt-8 pb-6 text-center">
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            <span className="mr-2">🧳</span>PACK &amp; PASS
                        </h1>
                        <p className="mt-1 text-sm text-indigo-200/80">
                            Pack smart — or border services stop you.
                        </p>
                    </div>

                    {phase === "ready" && (
                        <div className="px-8 py-8 text-center">
                            <div className="text-6xl">🛂</div>
                            <h2 className="mt-4 text-xl font-bold">
                                Can you pack the perfect case?
                            </h2>
                            <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left text-sm text-indigo-100/90">
                                <li>
                                    ✅ Pack items that are allowed into Canada.
                                </li>
                                <li>
                                    🚫 Reject prohibited & restricted goods —
                                    weapons, cannabis, fresh food, plants.
                                </li>
                                <li>
                                    ⚖️ Don't overload your {CAPACITY} kg
                                    suitcase.
                                </li>
                                <li>
                                    💥 {MAX_STRIKES} mistakes and security stops
                                    you.
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
                    )}

                    {phase === "playing" && (
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
                    )}

                    {phase === "over" && (
                        <div className="px-8 py-8 text-center">
                            <div className="text-6xl">🛬</div>
                            <h2 className="mt-4 text-2xl font-bold">
                                {strikes >= MAX_STRIKES
                                    ? "Held at the border!"
                                    : "Time's up!"}
                            </h2>
                            <p className="mt-2 text-sm text-indigo-200/80">
                                Your suitcase is ready — mostly.
                            </p>

                            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                                {newBest && (
                                    <div className="mb-1 text-xs font-bold tracking-widest text-amber-300 uppercase">
                                        New high score 🏆
                                    </div>
                                )}
                                <div className="text-5xl font-extrabold">
                                    {score}
                                </div>
                                <div className="mt-1 text-xs font-medium tracking-widest text-indigo-200/70 uppercase">
                                    Final score
                                </div>
                                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
                                    <div>
                                        <div className="text-xl font-bold">
                                            {packed}
                                        </div>
                                        <div className="text-indigo-200/70">
                                            Packed
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">
                                            {caught}
                                        </div>
                                        <div className="text-indigo-200/70">
                                            Rejected
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold">
                                            {Math.max(best, score)}
                                        </div>
                                        <div className="text-indigo-200/70">
                                            Best
                                        </div>
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
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;

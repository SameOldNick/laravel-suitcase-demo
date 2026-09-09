import { Item, ITEMS } from "@/data/suitcase-items";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import ReadyPhase from "./components/ready-phase";
import PlayingPhase from "./components/playing-phase";
import FinishedPhase from "./components/finished-phase";
import {
    CAPACITY,
    GOOD_CATCH_BONUS,
    HIGH_SCORE_KEY,
    MAX_STRIKES,
    OVERPACK_PENALTY,
    PACK_BANNED_PENALTY,
    REJECT_SAFE_PENALTY,
    ROUND_TIME,
} from "./constants";
import { Feedback } from "./typings";

type Phase = "ready" | "playing" | "finished";

function randomItem(excludeId?: string): Item {
    const pool = excludeId
        ? ITEMS.filter((item) => item.id !== excludeId)
        : ITEMS;
    return pool[Math.floor(Math.random() * pool.length)];
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
    const [feedback, setFeedback] = useState<Feedback | undefined>();

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
            setPhase("finished");
        }
    }, [phase, timeLeft, strikes, score, best]);

    useEffect(() => {
        if (phase !== "finished") return;

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

        const timer = window.setTimeout(() => setFeedback(undefined), 900);

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
        setFeedback(undefined);
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

                    {phase === "ready" && <ReadyPhase start={start} />}

                    {phase === "playing" && (
                        <PlayingPhase
                            item={item}
                            score={score}
                            weight={weight}
                            strikes={strikes}
                            timeLeft={timeLeft}
                            weightPercent={weightPercent}
                            feedback={feedback}
                            decide={decide}
                        />
                    )}

                    {phase === "finished" && (
                        <FinishedPhase
                            score={score}
                            packed={packed}
                            caught={caught}
                            best={best}
                            newBest={newBest}
                            strikes={strikes}
                            start={start}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;

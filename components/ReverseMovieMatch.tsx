"use client";

import { useState, useCallback } from "react";
import { RefreshCw, Eye, ChevronRight, Film } from "lucide-react";
import { cn } from "@/lib/utils";

interface Movie {
  clue: string;
  answer: string;
  explanation: string;
  emoji: string;
  type: "bollywood" | "hollywood";
}

const MOVIES: Movie[] = [
  // Bollywood
  {
    clue: "A highly qualified engineer spends three years convincing everyone that memorising answers is less useful than understanding the question. Nobody listens until someone nearly dies.",
    answer: "3 Idiots",
    explanation: "The entire film is Rancho trying to explain 'learn, don't mug up' while everyone around him chases ranks. The near-death is what finally gets through.",
    emoji: "🎓",
    type: "bollywood",
  },
  {
    clue: "Three grown men take a very expensive, heavily Instagrammed road trip to resolve personal issues they could have addressed over a single honest phone call.",
    answer: "Zindagi Na Milegi Dobara",
    explanation: "Arjun, Kabir, and Imran spend weeks in Spain skydiving and deep-sea diving when one honest conversation each would have sorted everything by day two.",
    emoji: "🚗",
    type: "bollywood",
  },
  {
    clue: "A woman misses a local train and considers it the worst thing that has ever happened to her. It turns out to be fine, actually.",
    answer: "Jab We Met",
    explanation: "Geet missing the train at Ratlam station kicks off the entire plot. What feels like a disaster is the best thing that ever happened to both leads.",
    emoji: "🚂",
    type: "bollywood",
  },
  {
    clue: "A man quits a very good NASA job to go fix a government water pump in a village. His colleagues think he has had a breakdown.",
    answer: "Swades",
    explanation: "Mohan Bhargava leaves NASA, returns to rural India, and installs a micro-hydro power plant. By most corporate standards, this is an extreme career pivot.",
    emoji: "🌾",
    type: "bollywood",
  },
  {
    clue: "An alien visits Earth, gets confused by religion, politics, and television remotes, and concludes that humans have been given wrong numbers.",
    answer: "PK",
    explanation: "PK spends the whole film baffled that the same God supposedly created all religions but gave everyone completely different instruction manuals.",
    emoji: "📻",
    type: "bollywood",
  },
  {
    clue: "A substitute art teacher notices a child struggling and does something about it. Every other adult in the film was too busy to notice.",
    answer: "Taare Zameen Par",
    explanation: "Nikumbh sir is the only adult who actually observes Ishaan instead of just grading him. The film is essentially about what happens when one person pays attention.",
    emoji: "🎨",
    type: "bollywood",
  },
  {
    clue: "A national hockey coach recruits a team by standing quietly near women playing sport in various cities and not explaining himself properly for several weeks.",
    answer: "Chak De! India",
    explanation: "Kabir Khan's entire scouting strategy is to watch matches silently and then hand women a card. No proper briefing, no formal tryouts. Very confusing for everyone involved.",
    emoji: "🏑",
    type: "bollywood",
  },
  // Hollywood
  {
    clue: "Several adults spend multiple years, cross multiple timelines, and survive multiple near-death experiences arguing over who gets to keep a ring that everyone agrees should simply be destroyed.",
    answer: "The Lord of the Rings",
    explanation: "The entire three-film plot is a delivery mission that gets complicated because the item cannot be shipped and the recipient refuses to let anyone else carry it.",
    emoji: "💍",
    type: "hollywood",
  },
  {
    clue: "A team repeatedly enters someone's workplace without permission because the person refuses to change their mind through normal conversation.",
    answer: "Inception",
    explanation: "Cobb and team break into Fischer's subconscious three layers deep because nobody thought to just have a direct business meeting. Corporate espionage has apparently evolved.",
    emoji: "🌀",
    type: "hollywood",
  },
  {
    clue: "A father leaves his children, travels very far away, and keeps sending messages home that arrive slightly out of order. He is considered a hero for eventually coming back.",
    answer: "Interstellar",
    explanation: "Cooper crosses a black hole, ages differently from everyone he loves, and communicates via a bookshelf. By any normal parenting standard, this is a lot to put your kids through.",
    emoji: "🚀",
    type: "hollywood",
  },
];

const BOLLYWOOD_COUNT = MOVIES.filter((m) => m.type === "bollywood").length;
const HOLLYWOOD_COUNT = MOVIES.filter((m) => m.type === "hollywood").length;

export default function ReverseMovieMatch() {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [score, setScore] = useState({ yes: 0, no: 0 });
  const [voted, setVoted] = useState<Set<number>>(new Set());

  const movie = MOVIES[current];
  const isRevealed = revealed.has(current);
  const hasVoted = voted.has(current);
  const isLast = current === MOVIES.length - 1;

  const reveal = useCallback(() => {
    setRevealed((prev) => new Set(prev).add(current));
  }, [current]);

  const vote = useCallback((got: boolean) => {
    if (hasVoted) return;
    setVoted((prev) => new Set(prev).add(current));
    setScore((prev) => ({ ...prev, [got ? "yes" : "no"]: prev[got ? "yes" : "no"] + 1 }));
  }, [hasVoted, current]);

  const reset = useCallback(() => {
    setCurrent(0);
    setRevealed(new Set());
    setScore({ yes: 0, no: 0 });
    setVoted(new Set());
  }, []);

  const accuracy = score.yes + score.no > 0
    ? Math.round((score.yes / (score.yes + score.no)) * 100)
    : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-[#111111]">
        <div>
          <h2 className="text-base font-bold text-white">🎬 Reverse Movie Match</h2>
          <p className="text-xs text-[#6b7280]">
            {BOLLYWOOD_COUNT} Bollywood · {HOLLYWOOD_COUNT} Hollywood · Guess from the clue!
          </p>
        </div>
        <div className="flex items-center gap-2">
          {accuracy !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#222]">
              <Film size={13} className="text-[#a78bfa]" />
              <span className="text-sm font-bold text-white">{score.yes}/{score.yes + score.no}</span>
              <span className="text-xs text-[#6b7280]">got it</span>
            </div>
          )}
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#111111] text-[#9ca3af] hover:text-white hover:bg-[#222222] transition-all"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex-shrink-0 flex gap-1.5 px-4 py-3 border-b border-[#111111] overflow-x-auto">
        {MOVIES.map((m, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); }}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap transition-all",
              i === current
                ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                : revealed.has(i)
                ? "bg-[#111] border-[#333] text-[#6b7280]"
                : "bg-[#0a0a0a] border-[#1a1a1a] text-[#4b5563]"
            )}
          >
            {m.emoji}
            <span className={cn(
              "text-[10px] ml-0.5 font-bold",
              m.type === "bollywood" ? "text-orange-400" : "text-blue-400"
            )}>
              {m.type === "bollywood" ? "B" : "H"}
            </span>
            {revealed.has(i) && <span className="ml-0.5">✓</span>}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {/* Counter + badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#6b7280]">Clue {current + 1} of {MOVIES.length}</span>
            <span className={cn(
              "text-xs px-2.5 py-0.5 rounded-full font-bold border",
              movie.type === "bollywood"
                ? "bg-orange-950 border-orange-700 text-orange-400"
                : "bg-blue-950 border-blue-700 text-blue-400"
            )}>
              {movie.type === "bollywood" ? "🎭 Bollywood" : "🎥 Hollywood"}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-[#111111] rounded-full mb-6">
            <div
              className="h-1 bg-[#7c3aed] rounded-full transition-all duration-300"
              style={{ width: `${((current + 1) / MOVIES.length) * 100}%` }}
            />
          </div>

          {/* Clue card */}
          <div className={cn(
            "rounded-2xl border p-8 text-center mb-5 transition-all duration-200",
            isRevealed
              ? "bg-[#0d0d1a] border-[#7c3aed] shadow-[0_0_25px_rgba(124,58,237,0.12)]"
              : "bg-[#0a0a0a] border-[#1a1a1a]"
          )}>
            <div className="text-5xl mb-5">{movie.emoji}</div>
            <p className="text-base sm:text-lg font-medium text-[#e5e7eb] leading-relaxed italic">
              &ldquo;{movie.clue}&rdquo;
            </p>
          </div>

          {/* Answer reveal */}
          {!isRevealed ? (
            <div className="flex flex-col items-center gap-3 mb-5">
              <p className="text-xs text-[#6b7280]">Discuss with your team, then reveal the answer</p>
              <button
                onClick={reveal}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#8b5cf6] text-white text-sm font-bold transition-all active:scale-95"
              >
                <Eye size={15} />
                Reveal Answer
              </button>
            </div>
          ) : (
            <div className="mb-5">
              {/* Answer box */}
              <div className="rounded-xl border border-[#7c3aed] bg-[#0d0d1a] px-5 py-4 mb-3 text-center">
                <p className="text-xs text-[#9ca3af] mb-1">The movie is</p>
                <p className="text-2xl font-bold text-[#c4b5fd]">{movie.answer}</p>
              </div>
              {/* Explanation */}
              <div className="rounded-xl border border-[#222] bg-[#0a0a0a] px-4 py-3 text-sm text-[#9ca3af] leading-relaxed mb-4">
                <span className="text-[#6b7280] font-semibold mr-1">Why it fits:</span>
                {movie.explanation}
              </div>
              {/* Did your team get it? */}
              {!hasVoted ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-[#6b7280]">Did your team guess it?</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => vote(true)}
                      className="px-5 py-2 rounded-xl bg-[#052e16] border border-green-700 text-green-400 text-sm font-bold hover:bg-green-900 transition-all active:scale-95"
                    >
                      ✅ Yes, we got it!
                    </button>
                    <button
                      onClick={() => vote(false)}
                      className="px-5 py-2 rounded-xl bg-[#1c0a0a] border border-red-800 text-red-400 text-sm font-bold hover:bg-red-950 transition-all active:scale-95"
                    >
                      ❌ Nope, stumped!
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center text-xs text-[#6b7280]">
                  {voted.has(current) && score.yes > 0 && !voted.has(current - 1)
                    ? "Recorded!"
                    : "Recorded!"}
                </p>
              )}
            </div>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrent((i) => Math.max(i - 1, 0))}
              disabled={current === 0}
              className="px-4 py-2 text-sm text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {isLast && isRevealed ? (
              <div className="text-center text-sm text-[#a78bfa] font-semibold animate-pulse">
                🏆 All done! Team score: {score.yes}/{MOVIES.length}
              </div>
            ) : (
              <button
                onClick={() => { if (!isLast) setCurrent((i) => i + 1); }}
                disabled={isLast}
                className={cn(
                  "flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 border",
                  isLast
                    ? "opacity-30 cursor-not-allowed bg-[#111] border-[#222] text-[#555]"
                    : "bg-[#111] border-[#333] text-[#9ca3af] hover:text-white hover:border-[#555]"
                )}
              >
                Next <ChevronRight size={15} />
              </button>
            )}
            <button
              onClick={() => setCurrent((i) => Math.min(i + 1, MOVIES.length - 1))}
              disabled={isLast}
              className="px-4 py-2 text-sm text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

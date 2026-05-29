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
    clue: "Two best friends spend an entire film trying to find a third friend. The third friend had a perfectly good address the whole time and could have just texted.",
    answer: "3 Idiots",
    explanation: "The entire framing device of the film is Farhan and Raju searching for Rancho across India — a man who simply changed his name and moved to a village. One LinkedIn search would have ended the movie in 4 minutes.",
    emoji: "🎓",
    type: "bollywood",
  },
  {
    clue: "A man chooses a foreign woman over a perfectly nice local option, and his entire extended family treats this as a national emergency requiring immediate travel to Europe.",
    answer: "DDLJ",
    explanation: "Raj follows Simran to London, then to Punjab, while the entire Chaudhary family mobilises like it's a military operation — all because Bauji disapproved of one guy on a Europass holiday.",
    emoji: "🌻",
    type: "bollywood",
  },
  {
    clue: "A woman talks so much on a train that a complete stranger has an existential crisis and decides to completely change his life. She is entirely unaware of her impact.",
    answer: "Jab We Met",
    explanation: "Geet spends the entire film being chaotically herself while Aditya — a depressed businessman — quietly rebuilds his entire personality by just being near her. She never realises she accidentally fixed him.",
    emoji: "🚂",
    type: "bollywood",
  },
  {
    clue: "A man with a six-figure international salary quits to go fix a power cut in a village. The village had been managing just fine with kerosene for decades.",
    answer: "Swades",
    explanation: "Mohan Bhargava is so deeply moved by a village's electricity situation that he gives up NASA. The villagers were arguably more puzzled than grateful for the first few weeks.",
    emoji: "🌾",
    type: "bollywood",
  },
  {
    clue: "An outsider with no social conditioning discovers that the same helpline number gives completely different answers depending on which neighbourhood you call from.",
    answer: "PK",
    explanation: "PK's entire investigation is basically a mystery novel where the plot twist is: all the instruction manuals for the same product are different and none of them are official. Also the CEO is unreachable.",
    emoji: "📻",
    type: "bollywood",
  },
  {
    clue: "A child is repeatedly failed by every institution designed to help him, until a man with a guitar and zero respect for the school syllabus shows up.",
    answer: "Taare Zameen Par",
    explanation: "Ishaan is let down by his school, his teachers, and initially his parents. Nikumbh sir arrives, ignores the curriculum entirely, and sorts everything out through art. Education boards remain unimpressed.",
    emoji: "🎨",
    type: "bollywood",
  },
  {
    clue: "A disgraced man is given one last chance to coach a national team. His primary management strategy is making them scrub a bathroom floor together.",
    answer: "Chak De! India",
    explanation: "Kabir Khan's first team-building exercise is a bathroom cleaning session. It is somehow the most effective HR intervention in Indian sporting history.",
    emoji: "🏑",
    type: "bollywood",
  },
  // Hollywood
  {
    clue: "A small, anxious freelancer is selected for a dangerous long-distance courier job entirely because his support group vouched for him. He nearly dies 94 times. He completes the delivery.",
    answer: "The Lord of the Rings",
    explanation: "Frodo is chosen to carry the One Ring primarily because Gandalf has a gut feeling. No formal evaluation, no risk assessment. The entire fellowship is basically unsanctioned volunteer work.",
    emoji: "💍",
    type: "hollywood",
  },
  {
    clue: "A consultant is hired to plant an idea in a client's head. Rather than writing a memo, he constructs four nested realities and nearly loses two colleagues to physics.",
    answer: "Inception",
    explanation: "Cobb's job is to make Fischer change his mind about his father's company. The solution: build a dream inside a dream inside a dream inside a van falling off a bridge. No one considered a strongly-worded email.",
    emoji: "🌀",
    type: "hollywood",
  },
  {
    clue: "A father leaves his children for what he promises will be a short work trip. He returns after 80 years, aged about 45. He expects a warm welcome.",
    answer: "Interstellar",
    explanation: "Cooper tells his kids he'll be back soon, then spends decades near a black hole where time moves differently. He returns to find his daughter is older than him and still furious about the bookshelf incident.",
    emoji: "🚀",
    type: "hollywood",
  },

  // Round 2 — Bollywood
  {
    clue: "A woman leaves her own wedding, boards a random bus, and spends three weeks in Europe alone. Her family considers this a scandal. She considers it a Tuesday.",
    answer: "Queen",
    explanation: "Rani goes on her honeymoon solo after being dumped the day before the wedding. She ends up having a better time than she ever would have with the groom. He is not missed.",
    emoji: "👑",
    type: "bollywood",
  },
  {
    clue: "A man pretends to be a doctor for several months. Nobody notices because he is polite and brings fruit.",
    answer: "Munna Bhai MBBS",
    explanation: "Munna convinces an entire hospital and his own parents that he is a qualified physician through charm and zero medical knowledge. The fruit is key. Hospitals should really check IDs.",
    emoji: "🩺",
    type: "bollywood",
  },
  {
    clue: "A college dropout returns home, says very little, and accidentally fixes a multi-generational family feud by just being unbothered.",
    answer: "Dil Dhadakne Do",
    explanation: "Kabir and Aalia are stuck on a cruise with their deeply dysfunctional family. The children spend ten days watching their parents' thirty-year marriage collapse in real time. The boat is a metaphor.",
    emoji: "🚢",
    type: "bollywood",
  },
  {
    clue: "A man spends twenty years chasing a childhood crush who has no idea he exists. He eventually gives up. She immediately notices him.",
    answer: "Kuch Kuch Hota Hai",
    explanation: "Rahul is completely oblivious to Anjali for eight years. The moment he stops caring, she shows up in a sari and he forgets his entire fiancée. Timing is everything in Bollywood.",
    emoji: "🏀",
    type: "bollywood",
  },
  {
    clue: "A deeply unqualified man is handed the most important job in the country based entirely on a recommendation from someone who met him at a tea stall.",
    answer: "Nayak",
    explanation: "Shivaji Rao becomes Chief Minister for a day on a bet, then accidentally becomes competent at it. The entire premise is that the existing politicians were so bad that a random person was an upgrade.",
    emoji: "🏛️",
    type: "bollywood",
  },
  {
    clue: "Two strangers agree to swap life problems as a favour. Both problems get significantly worse before one of them gets better.",
    answer: "Rab Ne Bana Di Jodi",
    explanation: "Surinder disguises himself as a completely different person to win over his own wife. She falls for the disguise. He then has an identity crisis about which version of himself she actually likes.",
    emoji: "🥸",
    type: "bollywood",
  },
  {
    clue: "A group of friends go on a holiday specifically to not think about their problems. Every single one of their problems follows them on the trip.",
    answer: "Dil Chahta Hai",
    explanation: "Akash, Sid, and Sameer go to Goa to have fun. Sameer falls in love immediately, Sid is already in love, and Akash falls in love despite aggressively not wanting to. Goa did nothing.",
    emoji: "🌊",
    type: "bollywood",
  },

  // Round 2 — Hollywood
  {
    clue: "A man discovers his entire life is a television programme. Rather than seeking therapy, he attempts to sail out of the set.",
    answer: "The Truman Show",
    explanation: "Truman Burbank has been on live TV since birth without consent. When he figures it out, his solution is to sail to the literal edge of the world. HR at Omnicom would have a field day.",
    emoji: "📺",
    type: "hollywood",
  },
  {
    clue: "Two men spend years copying each other's homework and then both fail the assignment anyway.",
    answer: "The Prestige",
    explanation: "Angier and Borden dedicate their entire lives to ruining each other's magic acts. Both lose everything. The trick that started the rivalry was performed correctly the first time.",
    emoji: "🎩",
    type: "hollywood",
  },
  {
    clue: "A retired hitman tries to quit his job. His employer sends 84 people to stop him from doing this. None of them succeed.",
    answer: "John Wick",
    explanation: "John Wick just wants to be left alone after his dog is killed. The Russian mob sends an escalating number of assassins to prevent this retirement. The math never works in their favour.",
    emoji: "🐶",
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

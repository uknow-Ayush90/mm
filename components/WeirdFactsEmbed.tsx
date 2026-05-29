"use client";

import { useState, useCallback } from "react";
import { RefreshCw, Eye, EyeOff, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Person {
  name: string;
  emoji: string;
  facts: string[];
}

// ✏️ EDIT THIS ARRAY — add your team members here
const PEOPLE: Person[] = [
  {
    name: "Earjina",
    emoji: "🧑‍💻",
    facts: [
      "Prefer freshly cooked food only, avoid eating the same food again. Store leftovers in the fridge even though I know I won't eat them, then discard them after ~10 days.",
    ],
  },
  {
    name: "shrishti",
    emoji: "🏗️",
    facts: [
      "I was an athlete in my school days. To be specific a sprinter :)",
    ],
  },
  {
    name: "Ayush-me",
    emoji: "📋",
    facts: [
      "Had 10% attendance in my college days",
    ],
  },
  {
    name: "shreya",
    emoji: "🐍",
    facts: [
      "I'm scared of the dark, yet voluntarily watch horror movies — with one eye closed for safety 😄",
    ],
  },
  {
    name: "Tarun",
    emoji: "🎯",
    facts: [
      "I used to play Sitar in school.",
    ],
  },
  {
    name: "Gowthami",
    emoji: "🚀",
    facts: [
      "I fall asleep under stress — anywhere, anytime. College exam in 10 minutes? Napped for 20. A friend had to shake me awake. CEO's room? Also fine for a nap. I also remember almost all my dreams, and about 70% of them come true — I only realise it mid-moment, like I've already lived this scene before.",
    ],
  },
];

export default function WeirdFactsEmbed() {
  const [currentPerson, setCurrentPerson] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [nameRevealed, setNameRevealed] = useState(false);

  const person = PEOPLE[currentPerson];
  const fact = person?.facts[currentFact];
  const isLastFact = currentFact === person.facts.length - 1;
  const isLastPerson = currentPerson === PEOPLE.length - 1;

  const nextFact = useCallback(() => {
    if (!isLastFact) {
      setCurrentFact((i) => i + 1);
      setNameRevealed(false);
    }
  }, [isLastFact]);

  const nextPerson = useCallback(() => {
    if (!isLastPerson) {
      setCurrentPerson((i) => i + 1);
      setCurrentFact(0);
      setNameRevealed(false);
    }
  }, [isLastPerson]);

  const reset = useCallback(() => {
    setCurrentPerson(0);
    setCurrentFact(0);
    setNameRevealed(false);
  }, []);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 flex items-center justify-between border-b border-[#111111]">
        <div>
          <h2 className="text-base font-bold text-white">🕵️ Guess Who?</h2>
          <p className="text-xs text-[#6b7280]">Read the facts — guess the teammate!</p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#111111] text-[#9ca3af] hover:text-white hover:bg-[#222222] transition-all"
        >
          <RefreshCw size={14} />
          Reset
        </button>
      </div>

      {/* Progress pills */}
      <div className="flex-shrink-0 flex gap-1.5 px-4 py-3 border-b border-[#111111] overflow-x-auto">
        {PEOPLE.map((p, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap",
              i === currentPerson
                ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                : i < currentPerson
                ? "bg-[#111] border-[#333] text-[#6b7280]"
                : "bg-[#0a0a0a] border-[#1a1a1a] text-[#4b5563]"
            )}
          >
            {p.emoji}
            {i < currentPerson ? " ✓" : i === currentPerson ? " ?" : ""}
          </div>
        ))}
      </div>

      {/* Main card */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Fact counter */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#6b7280]">
              Person {currentPerson + 1} of {PEOPLE.length}
            </span>
            <span className="text-xs text-[#6b7280]">
              Clue {currentFact + 1} of {person.facts.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-[#111111] rounded-full mb-6">
            <div
              className="h-1 bg-[#7c3aed] rounded-full transition-all duration-300"
              style={{ width: `${((currentFact + 1) / person.facts.length) * 100}%` }}
            />
          </div>

          {/* Fact card */}
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-8 text-center mb-4">
            <div className="text-5xl mb-5">🤔</div>
            <p className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
              {fact}
            </p>
          </div>

          {/* Name reveal */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-sm text-[#6b7280]">Who is this?</span>
            <button
              onClick={() => setNameRevealed((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all",
                nameRevealed
                  ? "bg-[#7c3aed]/20 border-[#7c3aed] text-[#c4b5fd]"
                  : "bg-[#111] border-[#333] text-[#9ca3af] hover:border-[#7c3aed] hover:text-white"
              )}
            >
              {nameRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
              <span className={cn("transition-all", !nameRevealed && "blur-sm select-none")}>
                {person.emoji} {person.name}
              </span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!isLastFact ? (
              <button
                onClick={nextFact}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#111] border border-[#333] text-[#9ca3af] hover:text-white hover:border-[#555] text-sm font-semibold transition-all active:scale-95"
              >
                Next Clue <ChevronRight size={15} />
              </button>
            ) : null}
            {!isLastPerson ? (
              <button
                onClick={nextPerson}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#8b5cf6] text-white text-sm font-bold transition-all active:scale-95"
              >
                Next Person →
              </button>
            ) : (
              currentFact === person.facts.length - 1 && (
                <div className="text-center text-sm text-[#a78bfa] font-semibold animate-pulse py-2">
                  🎉 That&apos;s everyone! Hit Reset to play again.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

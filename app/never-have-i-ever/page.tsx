"use client";

import { useState, useCallback } from "react";
import { ChevronRight, RefreshCw, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "architect" | "python" | "scrum";

interface Question {
  text: string;
  roles: Role[];
  emoji: string;
}

const QUESTIONS: Question[] = [
  // Architect
  { text: "Never have I ever drawn an architecture diagram that no one understood but everyone nodded at", roles: ["architect"], emoji: "🏗️" },
  { text: "Never have I ever said 'it depends' to every technical question in a meeting", roles: ["architect"], emoji: "🤔" },
  { text: "Never have I ever designed a microservices architecture for a 3-page CRUD app", roles: ["architect"], emoji: "🧩" },
  { text: "Never have I ever approved a design just because the boxes and arrows looked clean", roles: ["architect"], emoji: "📐" },
  { text: "Never have I ever said 'we need to consider scalability' for a feature with 10 users", roles: ["architect"], emoji: "📈" },
  { text: "Never have I ever added a new abstraction layer to avoid writing actual code", roles: ["architect"], emoji: "🎭" },
  { text: "Never have I ever copy-pasted an architecture from AWS blog and called it custom design", roles: ["architect"], emoji: "☁️" },
  { text: "Never have I ever made a 50-slide architecture deck for a 2-week project", roles: ["architect"], emoji: "📊" },
  { text: "Never have I ever said 'eventually consistent' when I meant 'broken for now'", roles: ["architect"], emoji: "⏳" },
  { text: "Never have I ever introduced Kafka to a project that only needed a cron job", roles: ["architect"], emoji: "🔀" },

  // Python Developer
  { text: "Never have I ever pushed to main because 'it works on my machine'", roles: ["python"], emoji: "💻" },
  { text: "Never have I ever used a global variable and told no one", roles: ["python"], emoji: "🌍" },
  { text: "Never have I ever written a one-liner that took 30 minutes to debug later", roles: ["python"], emoji: "🐍" },
  { text: "Never have I ever named a variable 'data2' because 'data' was already taken", roles: ["python"], emoji: "📦" },
  { text: "Never have I ever copy-pasted from Stack Overflow without understanding it", roles: ["python"], emoji: "📋" },
  { text: "Never have I ever forgotten to activate a virtual environment and wondered why nothing works", roles: ["python"], emoji: "🔧" },
  { text: "Never have I ever written 'TODO: fix this later' and never fixed it", roles: ["python"], emoji: "📝" },
  { text: "Never have I ever used a try/except that catches literally everything including keyboard interrupts", roles: ["python"], emoji: "🙈" },
  { text: "Never have I ever pushed a requirements.txt with 200 packages for a 50-line script", roles: ["python"], emoji: "📜" },
  { text: "Never have I ever committed a .env file to git and had a heart attack", roles: ["python"], emoji: "🔑" },
  { text: "Never have I ever used 'import *' in production code", roles: ["python"], emoji: "⭐" },
  { text: "Never have I ever pip installed something globally on a production server", roles: ["python"], emoji: "💀" },

  // Scrum Master
  { text: "Never have I ever extended a meeting that could have been an email", roles: ["scrum"], emoji: "📧" },
  { text: "Never have I ever had a daily standup that lasted more than 30 minutes", roles: ["scrum"], emoji: "⏰" },
  { text: "Never have I ever said 'let's take this offline' and then never taken it offline", roles: ["scrum"], emoji: "📴" },
  { text: "Never have I ever moved a ticket to 'Done' when it wasn't actually done", roles: ["scrum"], emoji: "✅" },
  { text: "Never have I ever done a sprint retrospective where everyone said everything was fine", roles: ["scrum"], emoji: "😶" },
  { text: "Never have I ever added a task to the sprint mid-sprint and told the team it was 'small'", roles: ["scrum"], emoji: "🤏" },
  { text: "Never have I ever estimated story points for work I didn't understand", roles: ["scrum"], emoji: "🃏" },
  { text: "Never have I ever called an emergency sync just to ask something that was in the Jira ticket", roles: ["scrum"], emoji: "🚨" },
  { text: "Never have I ever had a velocity chart that went up only because we lowered story points", roles: ["scrum"], emoji: "📉" },
  { text: "Never have I ever rescheduled a retro 3 times and then just cancelled it", roles: ["scrum"], emoji: "🗑️" },

  // Cross-role (shared struggles)
  { text: "Never have I ever blamed production issues on 'a recent deployment' when I had no idea what happened", roles: ["architect", "python", "scrum"], emoji: "🔥" },
  { text: "Never have I ever said 'that's out of scope' to avoid doing work", roles: ["architect", "python", "scrum"], emoji: "🚧" },
  { text: "Never have I ever been in a 1-hour meeting and contributed nothing", roles: ["architect", "python", "scrum"], emoji: "😴" },
  { text: "Never have I ever googled something I should have known after 3 years in this job", roles: ["architect", "python", "scrum"], emoji: "🔍" },
  { text: "Never have I ever pretended to understand a technical decision and said 'makes sense'", roles: ["architect", "python", "scrum"], emoji: "🎭" },
  { text: "Never have I ever turned off Slack notifications during working hours", roles: ["architect", "python", "scrum"], emoji: "🔕" },
  { text: "Never have I ever written documentation that I knew would be outdated in 2 weeks", roles: ["architect", "python", "scrum"], emoji: "📖" },

  // Architect + Scrum combo
  { text: "Never have I ever created a technical roadmap that changed completely in the next sprint", roles: ["architect", "scrum"], emoji: "🗺️" },
  { text: "Never have I ever said 'we'll handle tech debt in the next sprint' for 6 consecutive sprints", roles: ["architect", "scrum"], emoji: "🧹" },

  // Python + Scrum combo
  { text: "Never have I ever estimated 'a few hours' for a task that took 3 days", roles: ["python", "scrum"], emoji: "⏱️" },
  { text: "Never have I ever secretly rewritten someone else's code and not told them", roles: ["python", "architect"], emoji: "🕵️" },
];

const ROLE_CONFIG = {
  architect: { label: "Architect", emoji: "🏗️", color: "bg-blue-600", border: "border-blue-500", text: "text-blue-400" },
  python: { label: "Python Dev", emoji: "🐍", color: "bg-yellow-600", border: "border-yellow-500", text: "text-yellow-400" },
  scrum: { label: "Scrum Master", emoji: "📋", color: "bg-green-600", border: "border-green-500", text: "text-green-400" },
};

type FilterMode = "all" | Role;

export default function NeverHaveIEverPage() {
  const [filter, setFilter] = useState<FilterMode>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState({ architect: 0, python: 0, scrum: 0 });
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [showScores, setShowScores] = useState(false);

  const filtered = QUESTIONS.filter(
    (q) => filter === "all" || q.roles.includes(filter as Role)
  );

  const current = filtered[currentIndex];

  const handleIHave = useCallback(() => {
    if (!current || revealed.has(currentIndex)) return;
    setRevealed((prev) => new Set(prev).add(currentIndex));
    setScores((prev) => {
      const updated = { ...prev };
      current.roles.forEach((r) => {
        updated[r] = (updated[r] ?? 0) + 1;
      });
      return updated;
    });
  }, [current, currentIndex, revealed]);

  const next = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, filtered.length - 1));
  }, [filtered.length]);

  const prev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setScores({ architect: 0, python: 0, scrum: 0 });
    setRevealed(new Set());
    setShowScores(false);
  }, []);

  const hasRevealed = revealed.has(currentIndex);
  const isLast = currentIndex === filtered.length - 1;

  return (
    <div className="min-h-full bg-black text-[#f9fafb] flex flex-col">
      {/* Header */}
      <div className="border-b border-[#111111] px-4 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">🍺 Never Have I Ever</h1>
          <p className="text-xs text-[#6b7280] mt-0.5">Tech edition — Architects, Pythonistas & Scrum Masters</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScores((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#111111] text-[#9ca3af] hover:text-white hover:bg-[#222222] transition-all"
          >
            <Trophy size={14} />
            Scores
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#111111] text-[#9ca3af] hover:text-white hover:bg-[#222222] transition-all"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Scores panel */}
      {showScores && (
        <div className="border-b border-[#111111] px-4 py-3 grid grid-cols-3 gap-3">
          {(Object.keys(ROLE_CONFIG) as Role[]).map((role) => (
            <div key={role} className={cn("rounded-xl p-3 border bg-[#0a0a0a]", ROLE_CONFIG[role].border)}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-base">{ROLE_CONFIG[role].emoji}</span>
                <span className={cn("text-xs font-semibold", ROLE_CONFIG[role].text)}>{ROLE_CONFIG[role].label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{scores[role]}</div>
              <div className="text-xs text-[#6b7280]">I have done this</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 px-4 py-3 border-b border-[#111111] overflow-x-auto">
        <button
          onClick={() => { setFilter("all"); setCurrentIndex(0); }}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
            filter === "all"
              ? "bg-[#7c3aed] border-[#7c3aed] text-white"
              : "bg-[#111111] border-[#222222] text-[#9ca3af] hover:text-white"
          )}
        >
          <Users size={12} />
          All Roles
        </button>
        {(Object.keys(ROLE_CONFIG) as Role[]).map((role) => (
          <button
            key={role}
            onClick={() => { setFilter(role); setCurrentIndex(0); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
              filter === role
                ? `${ROLE_CONFIG[role].color} ${ROLE_CONFIG[role].border} text-white`
                : `bg-[#111111] border-[#222222] text-[#9ca3af] hover:text-white`
            )}
          >
            {ROLE_CONFIG[role].emoji} {ROLE_CONFIG[role].label}
          </button>
        ))}
      </div>

      {/* Main card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#6b7280]">
              {currentIndex + 1} / {filtered.length}
            </span>
            <div className="flex gap-1">
              {current?.roles.map((r) => (
                <span
                  key={r}
                  className={cn("text-xs px-2 py-0.5 rounded-full font-semibold border", ROLE_CONFIG[r].border, ROLE_CONFIG[r].text, "bg-[#0a0a0a]")}
                >
                  {ROLE_CONFIG[r].emoji} {ROLE_CONFIG[r].label}
                </span>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1 bg-[#111111] rounded-full mb-6">
            <div
              className="h-1 bg-[#7c3aed] rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filtered.length) * 100}%` }}
            />
          </div>

          {/* Card */}
          <div className={cn(
            "relative rounded-2xl border p-8 text-center transition-all duration-200",
            hasRevealed
              ? "bg-[#0d0d1a] border-[#7c3aed] shadow-[0_0_30px_rgba(124,58,237,0.15)]"
              : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#333]"
          )}>
            <div className="text-5xl mb-5">{current?.emoji}</div>
            <p className="text-lg sm:text-xl font-semibold text-white leading-relaxed mb-8">
              {current?.text}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {!hasRevealed ? (
                <>
                  <button
                    onClick={handleIHave}
                    className="px-6 py-3 rounded-xl bg-[#7c3aed] hover:bg-[#8b5cf6] text-white font-bold text-sm transition-all active:scale-95"
                  >
                    🙋 I HAVE done this
                  </button>
                  <button
                    onClick={next}
                    disabled={isLast}
                    className={cn(
                      "px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border",
                      isLast
                        ? "bg-[#111] border-[#222] text-[#444] cursor-not-allowed"
                        : "bg-[#111111] border-[#333] text-[#9ca3af] hover:text-white hover:border-[#555]"
                    )}
                  >
                    😇 Never! Next →
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 text-[#a78bfa] font-semibold text-sm">
                    <span>🫣 Exposed! +1 drink</span>
                  </div>
                  <button
                    onClick={next}
                    disabled={isLast}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 border",
                      isLast
                        ? "bg-[#111] border-[#222] text-[#444] cursor-not-allowed"
                        : "bg-[#111111] border-[#333] text-[#9ca3af] hover:text-white hover:border-[#555]"
                    )}
                  >
                    Next question <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Nav */}
          <div className="flex justify-between mt-4">
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-sm text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {isLast && (
              <div className="text-center text-sm text-[#a78bfa] font-semibold animate-pulse">
                🎉 Game over! Check the scores!
              </div>
            )}
            <button
              onClick={next}
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

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
  { text: "Never have I ever drawn 6 boxes connected by arrows, called it 'the architecture', and then refused to explain what any of the arrows mean", roles: ["architect"], emoji: "🏗️" },
  { text: "Never have I ever said 'it depends' so many times in one meeting that someone wrote it on a sticky note and put it on my monitor", roles: ["architect"], emoji: "🤔" },
  { text: "Never have I ever proposed microservices for something that was essentially a contact form", roles: ["architect"], emoji: "🧩" },
  { text: "Never have I ever used the phrase 'event-driven' to describe a system that just has one cron job running at midnight", roles: ["architect"], emoji: "⚡" },
  { text: "Never have I ever said 'we'll handle scalability later' and then 'we need to handle scalability NOW' within the same quarter", roles: ["architect"], emoji: "📈" },
  { text: "Never have I ever added an abstraction layer, named it something like 'AbstractBaseEntityHandlerFactoryImpl', and felt good about it", roles: ["architect"], emoji: "🎭" },
  { text: "Never have I ever copy-pasted an entire AWS reference architecture, changed the font, and submitted it as my own design", roles: ["architect"], emoji: "☁️" },
  { text: "Never have I ever introduced Kafka into a project and watched the team's faces go from confused to more confused over 3 sprints", roles: ["architect"], emoji: "🔀" },
  { text: "Never have I ever said 'eventually consistent' in a client meeting and then had to google what it means on the way back", roles: ["architect"], emoji: "⏳" },
  { text: "Never have I ever made a diagram so complex that I myself could not explain it two weeks later", roles: ["architect"], emoji: "📊" },

  // Python Developer
  { text: "Never have I ever pushed directly to main at 5:58pm on a Friday and then immediately gone offline", roles: ["python"], emoji: "💻" },
  { text: "Never have I ever named three variables 'data', 'data2', and 'data_final' in the same function and called it a day", roles: ["python"], emoji: "📦" },
  { text: "Never have I ever written a regex, tested it on one example, declared it production-ready, and watched it fail on everything else", roles: ["python"], emoji: "🐍" },
  { text: "Never have I ever committed a .env file, panicked, deleted it in the next commit, and assumed that fixed it", roles: ["python"], emoji: "🔑" },
  { text: "Never have I ever copy-pasted code from Stack Overflow, changed the variable names, and told my team I wrote it from scratch", roles: ["python"], emoji: "📋" },
  { text: "Never have I ever written 'TODO: fix this properly' on a line that is now three years old and in production", roles: ["python"], emoji: "📝" },
  { text: "Never have I ever used except Exception: pass and then spent four hours debugging a bug that was silently swallowed by that very line", roles: ["python"], emoji: "🙈" },
  { text: "Never have I ever created a virtual environment called 'env', 'venv', 'venv2', and 'new_venv' in the same project because I forgot which one worked", roles: ["python"], emoji: "🔧" },
  { text: "Never have I ever written a one-liner so clever that even I couldn't read it the next morning", roles: ["python"], emoji: "🤯" },
  { text: "Never have I ever pip installed something globally on a server and then denied it when things broke", roles: ["python"], emoji: "💀" },

  // Scrum Master
  { text: "Never have I ever scheduled a 'quick 15-minute sync' that ended at 47 minutes because no one knew how to stop it", roles: ["scrum"], emoji: "⏰" },
  { text: "Never have I ever said 'let's take this offline' and then never mentioned it again, silently hoping everyone forgot", roles: ["scrum"], emoji: "📴" },
  { text: "Never have I ever moved a ticket to Done, thought about it for a second, and then moved it back to In Progress before anyone noticed", roles: ["scrum"], emoji: "✅" },
  { text: "Never have I ever done a retro where everyone gave green feedback and I knew at least three people were lying", roles: ["scrum"], emoji: "😶" },
  { text: "Never have I ever added a task to an ongoing sprint, said 'it's just a small thing', and watched it consume the entire sprint", roles: ["scrum"], emoji: "🤏" },
  { text: "Never have I ever given a task 13 story points because I genuinely didn't understand it and that felt honest", roles: ["scrum"], emoji: "🃏" },
  { text: "Never have I ever called an emergency meeting to share something that turned out to be in the Jira ticket everyone had already read", roles: ["scrum"], emoji: "🚨" },
  { text: "Never have I ever rescheduled a retrospective so many times that the team forgot what sprint it was for", roles: ["scrum"], emoji: "🗑️" },
  { text: "Never have I ever increased the team's velocity by simply reducing all story point estimates by 20%", roles: ["scrum"], emoji: "📉" },
  { text: "Never have I ever written 'per discussion' in a Jira comment when there was no discussion and I just made a decision", roles: ["scrum"], emoji: "💬" },

  // Cross-role
  { text: "Never have I ever blamed a production outage on 'a recent deployment' when I had absolutely no idea what actually happened", roles: ["architect", "python", "scrum"], emoji: "🔥" },
  { text: "Never have I ever said 'that's out of scope' specifically to avoid doing something I didn't want to do", roles: ["architect", "python", "scrum"], emoji: "🚧" },
  { text: "Never have I ever been in a one-hour meeting, contributed zero words, and left feeling exhausted anyway", roles: ["architect", "python", "scrum"], emoji: "😴" },
  { text: "Never have I ever googled something extremely basic, found the answer in 4 seconds, and closed the tab before anyone saw", roles: ["architect", "python", "scrum"], emoji: "🔍" },
  { text: "Never have I ever nodded confidently during a technical explanation I did not understand at all", roles: ["architect", "python", "scrum"], emoji: "🤝" },
  { text: "Never have I ever turned off Slack notifications, told no one, and then said 'oh I didn't see that message' with a straight face", roles: ["architect", "python", "scrum"], emoji: "🔕" },
  { text: "Never have I ever written documentation so vague that even I couldn't understand it two months later", roles: ["architect", "python", "scrum"], emoji: "📖" },
  { text: "Never have I ever said 'this is a temporary fix' and then watched it become the permanent solution for two years", roles: ["architect", "python", "scrum"], emoji: "🩹" },

  { text: "Never have I ever promised a technical roadmap in Q1, quietly updated it in Q2, and rebranded it as 'the new direction'", roles: ["architect", "scrum"], emoji: "🗺️" },
  { text: "Never have I ever said 'we'll tackle tech debt next sprint' in 8 consecutive sprint plannings", roles: ["architect", "scrum"], emoji: "🧹" },
  { text: "Never have I ever estimated something as '2 days' and then sent a message 6 days later saying 'almost done'", roles: ["python", "scrum"], emoji: "⏱️" },
  { text: "Never have I ever silently rewritten a colleague's entire function, committed it as a 'small refactor', and said nothing", roles: ["python", "architect"], emoji: "🕵️" },
];

const ROLE_CONFIG = {
  architect: { label: "Architect", emoji: "🏗️", color: "bg-blue-600", border: "border-blue-500", text: "text-blue-400" },
  python: { label: "Python Dev", emoji: "🐍", color: "bg-yellow-600", border: "border-yellow-500", text: "text-yellow-400" },
  scrum: { label: "Scrum Master", emoji: "📋", color: "bg-green-600", border: "border-green-500", text: "text-green-400" },
};

type FilterMode = "all" | Role;

export default function NeverHaveIEverEmbed() {
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
      current.roles.forEach((r) => { updated[r] = (updated[r] ?? 0) + 1; });
      return updated;
    });
  }, [current, currentIndex, revealed]);

  const next = useCallback(() => setCurrentIndex((i) => Math.min(i + 1, filtered.length - 1)), [filtered.length]);
  const prev = useCallback(() => setCurrentIndex((i) => Math.max(i - 1, 0)), []);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setScores({ architect: 0, python: 0, scrum: 0 });
    setRevealed(new Set());
    setShowScores(false);
  }, []);

  const hasRevealed = revealed.has(currentIndex);
  const isLast = currentIndex === filtered.length - 1;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Top bar */}
      <div className="flex-shrink-0 px-4 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-[#111111]">
        <div>
          <h2 className="text-base font-bold text-white">🍺 Never Have I Ever — Tech Edition</h2>
          <p className="text-xs text-[#6b7280]">Architects, Python Devs & Scrum Masters</p>
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
        <div className="flex-shrink-0 border-b border-[#111111] px-4 py-3 grid grid-cols-3 gap-3">
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
      <div className="flex-shrink-0 flex gap-2 px-4 py-3 border-b border-[#111111] overflow-x-auto">
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
                : "bg-[#111111] border-[#222222] text-[#9ca3af] hover:text-white"
            )}
          >
            {ROLE_CONFIG[role].emoji} {ROLE_CONFIG[role].label}
          </button>
        ))}
      </div>

      {/* Card area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#6b7280]">{currentIndex + 1} / {filtered.length}</span>
            <div className="flex gap-1 flex-wrap justify-end">
              {current?.roles.map((r) => (
                <span key={r} className={cn("text-xs px-2 py-0.5 rounded-full font-semibold border bg-[#0a0a0a]", ROLE_CONFIG[r].border, ROLE_CONFIG[r].text)}>
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
            "rounded-2xl border p-8 text-center transition-all duration-200",
            hasRevealed
              ? "bg-[#0d0d1a] border-[#7c3aed] shadow-[0_0_30px_rgba(124,58,237,0.15)]"
              : "bg-[#0a0a0a] border-[#1a1a1a] hover:border-[#333]"
          )}>
            <div className="text-5xl mb-5">{current?.emoji}</div>
            <p className="text-lg sm:text-xl font-semibold text-white leading-relaxed mb-8">
              {current?.text}
            </p>

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
                  <span className="text-[#a78bfa] font-semibold text-sm">🫣 Exposed! +1 drink</span>
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

          {/* Prev / Next nav */}
          <div className="flex justify-between mt-4">
            <button onClick={prev} disabled={currentIndex === 0} className="px-4 py-2 text-sm text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              ← Prev
            </button>
            {isLast && (
              <span className="text-sm text-[#a78bfa] font-semibold animate-pulse">🎉 Game over! Check scores!</span>
            )}
            <button onClick={next} disabled={isLast} className="px-4 py-2 text-sm text-[#6b7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Upload, Trophy, Home, Menu, X, Flame, Gamepad2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import UserAvatar from "./UserAvatar";
import OnboardingModal from "./OnboardingModal";

const navLinks = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/never-have-i-ever", label: "Never Have I Ever", icon: Gamepad2 },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, showOnboarding } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur border-b border-[#222222]">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-[#7c3aed] rounded-lg flex items-center justify-center">
              <Flame size={18} className="text-white" />
            </div>
            <span className="hidden sm:block text-white">
              Team Ashoka{" "}
              <span className="text-[#7c3aed]">Memes</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? "bg-[#7c3aed]/20 text-[#8b5cf6]"
                    : "text-[#9ca3af] hover:text-white hover:bg-[#111111]"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/upload"
              className="hidden sm:flex items-center gap-2 bg-[#7c3aed] hover:bg-[#8b5cf6] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              <Upload size={15} />
              Upload
            </Link>

            {user ? (
              <Link
                href={`/profile/${user.username}`}
                className="flex items-center gap-2 hover:bg-[#111111] rounded-lg px-2 py-1.5 transition-colors"
              >
                <UserAvatar user={user} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-[#d1d5db]">
                  {user.displayName}
                </span>
              </Link>
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#222222] animate-pulse" />
            )}

            <button
              className="md:hidden p-2 rounded-lg hover:bg-[#111111] text-[#9ca3af]"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#222222] bg-[#0a0a0a] px-4 py-3 flex flex-col gap-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  pathname === href
                    ? "bg-[#7c3aed]/20 text-[#8b5cf6]"
                    : "text-[#9ca3af] hover:text-white hover:bg-[#111111]"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <Link
              href="/upload"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold bg-[#7c3aed] text-white hover:bg-[#8b5cf6]"
            >
              <Upload size={18} />
              Upload Meme
            </Link>
          </div>
        )}
      </nav>

      {showOnboarding && <OnboardingModal />}
    </>
  );
}

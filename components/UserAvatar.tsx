"use client";

import type { LocalUser } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  user: Pick<LocalUser, "displayName" | "avatarColor" | "username">;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-xl",
};

export default function UserAvatar({ user, size = "md" }: Props) {
  const initial = user.displayName?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-white select-none ring-2 ring-white/10",
        sizes[size]
      )}
      style={{ backgroundColor: user.avatarColor }}
      title={user.displayName}
    >
      {initial}
    </div>
  );
}

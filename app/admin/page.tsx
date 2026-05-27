"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import AdminPanel from "@/components/AdminPanel";
import { Shield, AlertTriangle } from "lucide-react";

function AdminContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const adminSecret = process.env.NEXT_PUBLIC_ADMIN_SECRET;

  // Client-side pre-check (real check is on server via API)
  if (!key) {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-4">
        <AlertTriangle size={48} className="text-yellow-400 mx-auto" />
        <h1 className="text-2xl font-bold text-white">Access Denied</h1>
        <p className="text-[#9ca3af]">
          Admin access ke liye URL mein <code className="text-[#7c3aed]">?key=your-secret</code> add karo
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <AdminPanel adminKey={key} />
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense>
      <AdminContent />
    </Suspense>
  );
}

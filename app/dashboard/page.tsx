"use client";

import { useEffect, useState } from "react";
import ClientSolveForm from "@/components/ClientSolveForm";

type Item = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/history", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      setItems(Array.isArray(data?.items) ? data.items : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border p-5">
        <div className="text-sm text-zinc-600">
          No login needed. Free daily limit applies per device/IP.
        </div>
      </div>

      {/* ✅ Question form back inside dashboard */}
      <ClientSolveForm onSolved={load} />

      <div className="rounded-2xl border p-5">
        <h2 className="font-semibold">Recent answers (latest 10)</h2>

        {loading ? (
          <div className="mt-2 text-sm text-zinc-600">Loading...</div>
        ) : items.length === 0 ? (
          <div className="mt-2 text-sm text-zinc-600">No history yet.</div>
        ) : (
          <div className="mt-3 space-y-3">
            {items.map((h) => (
              <div key={h.id} className="rounded-xl border p-3">
                <div className="text-sm font-medium">Q: {h.question}</div>
                <div className="mt-2 text-sm whitespace-pre-wrap text-zinc-700">
                  {h.answer}
                </div>
                <div className="mt-2 text-xs text-zinc-500">
                  {h.createdAt?.slice(0, 19).replace("T", " ")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

type Props = {
  onSolved?: () => void;
};

export default function ClientSolveForm({ onSolved }: Props) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const q = question.trim();
    if (!q) return setError("Please type a question.");

    setLoading(true);
    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Something went wrong");
        return;
      }

      setResult(data?.answer || "");
      onSolved?.();
    } catch (err: any) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border p-5">
      <h2 className="font-semibold text-lg">Ask your question</h2>
      <p className="text-sm text-zinc-600 mt-1">
        Type your homework question (Hindi / English) and click Solve.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <textarea
          className="w-full min-h-[120px] rounded-xl border p-3 outline-none focus:ring-2"
          placeholder="Example: 5+5=? या Photosynthesis क्या है?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl px-4 py-2 border bg-black text-white disabled:opacity-60"
        >
          {loading ? "Solving..." : "Solve"}
        </button>
      </form>

      {error && (
        <div className="mt-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 rounded-xl border p-4">
          <div className="text-sm font-semibold">Answer:</div>
          <div className="mt-2 whitespace-pre-wrap text-sm text-zinc-800">
            {result}
          </div>
        </div>
      )}
    </div>
  );
}

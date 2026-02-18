export const dynamic = "force-dynamic";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">AI Homework Helper</h1>
          <p className="mt-2 text-sm text-gray-600">
            Question likho aur turant answer lo. (Hindi + English)
          </p>
          <div className="mt-4 flex gap-3">
            <Link className="underline" href="/dashboard">
              Dashboard
            </Link>
            <Link className="underline" href="/support">
              Support
            </Link>
          </div>
        </header>

        <section className="rounded-xl border p-4">
          <h2 className="text-lg font-semibold">Ask a question</h2>

          <form
            className="mt-3 flex flex-col gap-3"
            action="/api/solve"
            method="POST"
          >
            <textarea
              name="question"
              placeholder="Example: 2+5 solve karo, ya koi homework question..."
              className="min-h-[140px] w-full rounded-lg border p-3 outline-none"
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-black px-4 py-2 text-white"
            >
              Solve
            </button>
          </form>

          <p className="mt-3 text-xs text-gray-500">
            Note: Agar answer nahi aata, to /api/solve me error ho sakta hai.
          </p>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { Hero } from "@/components/Hero";
import { LoadingState } from "@/components/LoadingState";
import { RoastCard } from "@/components/RoastCard";
import { getRoast, RoastError, type RoastResult } from "@/lib/getRoast";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<{ notFound: boolean; message: string } | null>(null);

  async function handleSubmit(username: string) {
    setStatus("loading");
    setError(null);

    try {
      const roast = await getRoast(username);
      setResult(roast);
      setStatus("success");
    } catch (err) {
      setResult(null);
      setError({
        notFound: err instanceof RoastError && err.status === 404,
        message: err instanceof Error ? err.message : "Something went wrong. Try again.",
      });
      setStatus("error");
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setStatus("idle");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0908] text-[#fff8ef]">
      <div className="noise pointer-events-none absolute inset-0 opacity-30" />
      <div className="ember ember-one" />
      <div className="ember ember-two" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
        <header className="flex items-center justify-between">
          <button
            className="group flex items-center gap-3 text-left"
            onClick={reset}
            aria-label="GitHub Roaster home"
          >
            <span className="brand-mark" aria-hidden="true">
              <span />
            </span>
            <span className="font-display text-lg font-black uppercase tracking-[-0.02em] sm:text-xl">
              GitHub <span className="text-[#ff5c35]">Roaster</span>
            </span>
          </button>
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/45 sm:block">
            Unsolicited code review
          </span>
        </header>

        <div className="flex flex-1 items-center justify-center py-12 sm:py-16">
          {status === "idle" && <Hero onSubmit={handleSubmit} />}
          {status === "loading" && <LoadingState />}
          {status === "success" && result && <RoastCard result={result} onReset={reset} />}
          {status === "error" && error && (
            <ErrorState notFound={error.notFound} message={error.message} onRetry={reset} />
          )}
        </div>

        <footer className="flex items-center justify-center gap-2 text-center text-xs text-white/35">
          <span className="h-px w-8 bg-white/10" />
          Real data. Real judgment.
          <span className="h-px w-8 bg-white/10" />
        </footer>
      </div>
    </main>
  );
}

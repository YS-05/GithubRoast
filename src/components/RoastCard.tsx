import { useState } from "react"
import type { RoastResult } from "../lib/getRoast"

type RoastCardProps = {
  result: RoastResult
  onReset: () => void
}

export function RoastCard({ result, onReset }: RoastCardProps) {
  const [copied, setCopied] = useState(false)
  const paragraphs = result.roast.split("\n\n")
  const isOwner = result.isOwner === true
  const stats = [
    { label: "Repos", value: result.user.publicRepos },
    { label: "Followers", value: result.user.followers },
    { label: "Total stars", value: result.stats.totalStars },
    { label: "Top languages", value: result.stats.topLanguages.join(" · ") },
  ]

  async function copyRoast() {
    const text = `${result.roast}\n\n${isOwner ? "Top compliments" : "Top burns"}:\n${result.burns.map((burn) => `— ${burn}`).join("\n")}`

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="result-enter w-full max-w-5xl">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#ff6842]">
            {isOwner ? "Owner detected" : "Public record reviewed"}
          </p>
          <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
            {isOwner ? "Here's what went right." : "Here's what went wrong."}
          </h1>
        </div>
        <span className="hidden text-xs font-semibold uppercase tracking-[0.15em] text-white/30 sm:block">
          Roast report / 001
        </span>
      </div>

      <div className="roast-card overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#15110f]/95">
        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="avatar-frame shrink-0">
                <img
                  src={result.user.avatarUrl}
                  alt={`${result.user.login}'s avatar`}
                  className="h-20 w-20 rounded-2xl object-cover sm:h-24 sm:w-24"
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-display truncate text-3xl font-black uppercase leading-none sm:text-4xl">
                  {result.user.name ?? result.user.login}
                </h2>
                <p className="mt-1.5 font-bold text-[#ff704b]">
                  @{result.user.login}
                </p>
                {result.user.bio && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#ab9c92]">
                    {result.user.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="stat-chip rounded-xl border border-white/8 bg-white/[0.035] p-3"
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/35">
                    {stat.label}
                  </p>
                  <p
                    className="mt-1 truncate text-sm font-extrabold text-[#fff4e9]"
                    title={String(stat.value)}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

            <div className="relative">
              <span className="quote-mark" aria-hidden="true">
                “
              </span>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#ff6842]">
                Full assessment
              </p>
              <div className="space-y-4 text-[15px] leading-7 text-[#ddcfc5] sm:text-base">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          <aside className="score-panel flex flex-col border-t border-white/10 p-5 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#ff8a68]">
              Roast score
            </p>
            {isOwner ? (
              <div className="mt-3">
                <span className="font-display score-number block text-6xl font-black lg:text-[2.6rem] leading-[0.9] tracking-tight">
                  Unroastable
                </span>
              </div>
            ) : (
              <div className="mt-2 flex items-end gap-2">
                <span className="font-display score-number text-[7rem] font-black leading-[0.85]">
                  {result.roastScore}
                </span>
                <span className="mb-2 text-lg font-extrabold text-white/30">
                  / 10
                </span>
              </div>
            )}
            <div
              className="mt-5 flex gap-1.5"
              aria-label={isOwner ? "Roast score: unroastable" : `Roast score: ${result.roastScore} out of 10`}
            >
              {Array.from({ length: 10 }, (_, index) => (
                <span
                  key={index}
                  className={`h-2 flex-1 skew-x-[-14deg] rounded-sm ${
                    !isOwner && index < result.roastScore
                      ? "bg-gradient-to-r from-[#ff3b1d] to-[#ff9e43] shadow-[0_0_8px_rgba(255,78,37,.45)]"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>

            <div className="mt-8 flex-1">
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-white/40">
                {isOwner ? "Top compliments" : "Top burns"}
              </p>
              <ol className="space-y-4">
                {result.burns.map((burn, index) => (
                  <li
                    key={burn}
                    className="flex gap-3 text-sm leading-5 text-[#d8c8bd]"
                  >
                    <span className="font-display text-lg font-black text-[#ff6842]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{burn}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button
          onClick={onReset}
          className="min-h-14 rounded-2xl border border-white/12 bg-white/[0.04] px-6 text-sm font-black uppercase tracking-[0.08em] text-white/75 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
        >
          Roast someone else
        </button>
        <button
          onClick={copyRoast}
          className="roast-button min-h-14 rounded-2xl px-8 text-sm font-black uppercase tracking-[0.08em] text-white"
        >
          {copied ? "Copied to clipboard" : "Copy roast"}
        </button>
      </div>
    </section>
  )
}

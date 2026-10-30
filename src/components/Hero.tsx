import { useState, type FormEvent } from "react";

type HeroProps = {
  onSubmit: (username: string) => void;
};

export function Hero({ onSubmit }: HeroProps) {
  const [username, setUsername] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanUsername = username.trim().replace(/^@/, "");

    if (cleanUsername) {
      onSubmit(cleanUsername);
    }
  }

  return (
    <section className="w-full max-w-4xl text-center">
      <div className="mb-5 inline-flex -rotate-2 items-center gap-2 rounded-full border border-[#ff643d]/30 bg-[#ff4d24]/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ff8c65]">
        <span className="inline-block h-2 w-2 rounded-full bg-[#ff512b] shadow-[0_0_14px_#ff512b]" />
        Your public mistakes, reviewed
      </div>

      <h1 className="font-display mx-auto max-w-4xl text-[clamp(4.2rem,13vw,9rem)] font-black uppercase leading-[0.77] tracking-[-0.075em]">
        GitHub
        <span className="hero-outline block pr-[0.06em]">Roaster</span>
      </h1>

      <p className="mx-auto mt-8 max-w-lg text-lg font-medium leading-relaxed text-[#c9bdb2] sm:text-xl">
        Enter a username.
        <span className="text-white"> We&apos;ll explain why those repos have no stars.</span>
      </p>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-9 flex max-w-2xl flex-col gap-3 sm:mt-11 sm:flex-row"
      >
        <label className="input-shell group flex min-h-16 flex-1 items-center rounded-2xl border border-white/12 bg-[#171311]/90 px-5 text-left transition focus-within:border-[#ff5c35]/70 focus-within:shadow-[0_0_0_4px_rgba(255,92,53,0.1)]">
          <span className="mr-2 text-xl font-bold text-[#ff6842]">@</span>
          <span className="sr-only">GitHub username</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="your-username"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-white outline-none placeholder:text-white/25"
          />
        </label>
        <button
          type="submit"
          disabled={!username.trim()}
          className="roast-button min-h-16 rounded-2xl px-8 text-base font-black uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Roast me <span aria-hidden="true">🔥</span>
        </button>
      </form>
    </section>
  );
}

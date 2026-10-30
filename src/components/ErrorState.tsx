type ErrorStateProps = {
  notFound: boolean;
  message: string;
  onRetry: () => void;
};

export function ErrorState({ notFound, message, onRetry }: ErrorStateProps) {
  return (
    <section className="error-card relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-[#ff5434]/20 bg-[#171210] p-8 text-center sm:p-12">
      <div className="error-code font-display" aria-hidden="true">
        {notFound ? "404" : "ERR"}
      </div>
      <div className="relative">
        <div className="mx-auto mb-6 flex h-16 w-16 rotate-3 items-center justify-center rounded-2xl border border-[#ff6a43]/30 bg-[#ff4d24]/10 text-3xl">
          <span className="font-display font-black text-[#ff6a43]">?</span>
        </div>
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-[#ff6a43]">
          {notFound ? "Nothing to review" : "Roast interrupted"}
        </p>
        <h2 className="font-display text-4xl font-black uppercase leading-none sm:text-5xl">
          {notFound ? "Username not found" : "Roast failed"}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[#baa99e]">
          {notFound
            ? "Either that's a typo, or they finally deleted the evidence. Check the spelling and try again."
            : message}
        </p>
        <button
          onClick={onRetry}
          className="roast-button mt-8 min-h-14 rounded-2xl px-8 text-sm font-black uppercase tracking-[0.1em] text-white"
        >
          Try again
        </button>
      </div>
    </section>
  );
}

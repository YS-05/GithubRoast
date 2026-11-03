import { useEffect, useState } from "react";

const messages = [
  "Skipping the tutorial projects...",
  "Looking for a finished project...",
  "Opening all your repos with nothing in them...",
  "Scrolling past the forks...",
  "Checking your last push. Give it a second...",
];

export function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // A real roast takes a few seconds, so rotate slowly
    const timer = window.setInterval(() => {
      setMessageIndex((current) => (current + 1) % messages.length);
    }, 1500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="flex max-w-xl flex-col items-center text-center" aria-live="polite">
      <div className="loader-wrap mb-10" aria-hidden="true">
        <span className="loader-flame flame-back" />
        <span className="loader-flame flame-front" />
        <span className="loader-core" />
      </div>
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.25em] text-[#ff6a43]">
        Roast in progress
      </p>
      <h2 className="font-display text-4xl font-black uppercase tracking-tight sm:text-6xl">
        Reviewing your choices
      </h2>
      <p key={messageIndex} className="loading-message mt-5 text-lg text-[#b9aaa0]">
        {messages[messageIndex]}
      </p>
    </section>
  );
}

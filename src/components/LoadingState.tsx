import { useEffect, useState } from "react";

const messages = [
  "Finding your last meaningful commit...",
  "Counting unfinished side projects...",
  "Looking for documentation. Any documentation...",
  "Checking test coverage. That was quick...",
  "Asking the AI to be gentle. It refused...",
];

export function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Slower than Figma's mock (600ms) since a real roast takes a few seconds
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
        Auditing public mistakes
      </p>
      <h2 className="font-display text-4xl font-black uppercase tracking-tight sm:text-6xl">
        Reviewing bad decisions
      </h2>
      <p key={messageIndex} className="loading-message mt-5 text-lg text-[#b9aaa0]">
        {messages[messageIndex]}
      </p>
    </section>
  );
}

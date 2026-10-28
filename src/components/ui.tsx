import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out ${shown ? "translate-y-0" : "translate-y-5"} ${className}`}
    >
      {children}
    </div>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-2.5" aria-label="Капитал будущего">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-[0_8px_20px_-6px_rgba(79,70,229,.7)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" />
          <path d="M8.5 14.5l2.5-2.5 1.8 1.8 2.7-3.3" />
        </svg>
      </span>
      <span className={`text-[17px] font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Капитал будущего <span className="text-indigo-500">· AI</span>
      </span>
    </a>
  );
}

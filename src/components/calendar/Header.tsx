"use client";

import { motion, useReducedMotion } from "framer-motion";

interface HeaderProps {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function Header({ monthLabel, onPrev, onNext, onToday }: HeaderProps) {
  const reducedMotion = useReducedMotion();

  return (
    <header className="mb-8 flex items-center justify-between pl-4">
      <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">
        {monthLabel}
      </h2>
      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-muted/20 text-muted hover:border-accent hover:text-accent transition-all hidden sm:block"
        >
          Today
        </button>
        <div className="flex items-center gap-1">
          <motion.button
            onClick={onPrev}
            whileHover={reducedMotion ? undefined : { scale: 1.1 }}
            whileTap={reducedMotion ? undefined : { scale: 0.9 }}
            className="neu-panel flex h-10 w-10 items-center justify-center text-muted hover:text-accent border border-white/5"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          <motion.button
            onClick={onNext}
            whileHover={reducedMotion ? undefined : { scale: 1.1 }}
            whileTap={reducedMotion ? undefined : { scale: 0.9 }}
            className="neu-panel flex h-10 w-10 items-center justify-center text-muted hover:text-accent border border-white/5"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </header>
  );
}

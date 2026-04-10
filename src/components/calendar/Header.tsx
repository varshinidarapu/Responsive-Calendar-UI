"use client";

import { motion, useReducedMotion } from "framer-motion";

interface HeaderProps {
  monthLabel: string;
  onPrev: () => void;
  onNext: () => void;
}

export function Header({ monthLabel, onPrev, onNext }: HeaderProps) {
  const reducedMotion = useReducedMotion();

  return (
    <header className="mb-4 flex items-center justify-between pl-2">
      <h2 className="text-[24px] sm:text-[28px] font-bold text-[#1e293b] uppercase">
        {monthLabel}
      </h2>
      <div className="flex items-center gap-1 pr-2">
        <motion.button
          type="button"
          onClick={onPrev}
          whileHover={reducedMotion ? undefined : { scale: 1.05 }}
          whileTap={reducedMotion ? undefined : { scale: 0.95 }}
          className="bg-white/40 shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)] rounded-lg flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center text-slate-600 transition-colors hover:text-slate-900 border border-white/50"
          aria-label="Go to previous month"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          type="button"
          onClick={onNext}
          whileHover={reducedMotion ? undefined : { scale: 1.05 }}
          whileTap={reducedMotion ? undefined : { scale: 0.95 }}
          className="bg-white/40 shadow-[2px_2px_5px_rgba(0,0,0,0.05),-2px_-2px_5px_rgba(255,255,255,0.8)] rounded-lg flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center text-slate-600 transition-colors hover:text-slate-900 border border-white/50"
          aria-label="Go to next month"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </header>
  );
}


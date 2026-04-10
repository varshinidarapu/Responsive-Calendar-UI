"use client";

import { format, isSameDay } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { CalendarDay } from "@/types/calendar";
import { memo, useState, useEffect } from "react";

interface DayCellProps {
  day: CalendarDay;
  isStart: boolean;
  isEnd: boolean;
  isInRange: boolean;
  onSelect: (date: Date) => void;
  onHover: (date: Date | null) => void;
  motionVariants: Variants;
  note?: string;
}

function parseNotePayload(raw: string): { combined: string; display: string } {
  if (!raw) return { combined: "", display: "" };
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      const parts = [];
      if (parsed.events) parts.push(parsed.events);
      if (Array.isArray(parsed.goals)) {
        parsed.goals.filter((g: any) => !g.done).forEach((g: any) => parts.push(g.text));
      }
      const combined = parts.join(" ");
      const display = parsed.events || (parts.length > 0 ? parts[0] : "");
      return { combined, display };
    }
  } catch (e) {}
  return { combined: raw, display: raw };
}

function getNoteIcon(text: string): string | null {
  if (text.includes("🎂")) return "🎂";
  if (text.includes("🕘")) return "🕘";
  if (text.includes("🚨")) return "🚨";
  if (text.includes("🧳")) return "🧳";
  if (text.includes("🎯")) return "🎯";
  if (text.includes("📈")) return "📈";
  if (text.includes("📌")) return "📌";
  return null;
}

export const DayCell = memo(({
  day,
  isStart,
  isEnd,
  isInRange,
  onSelect,
  onHover,
  motionVariants,
  note,
}: DayCellProps) => {
  const selectedEdge = isStart || isEnd;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const textClasses = day.inCurrentMonth
    ? day.isWeekend ? "text-blue-500/80 font-bold" : "text-card-foreground font-medium"
    : "text-muted-foreground opacity-20 pointer-events-none";

  const neumoClasses = day.isWeekend 
    ? "bg-blue-500/10 border-blue-500/20"
    : "bg-card/30 border border-white/5";

  const stateClasses = (() => {
    if (selectedEdge) {
      return "text-white bg-accent border-accent shadow-xl shadow-accent/20 font-black scale-[1.05] z-10";
    }
    if (isInRange) {
      return "text-accent bg-accent/10 border-accent/40";
    }
    return neumoClasses;
  })();

  const isActuallyToday = isMounted && isSameDay(day.date, new Date());
  
  return (
    <motion.button
      variants={motionVariants}
      onClick={() => onSelect(day.date)}
      onMouseEnter={() => onHover(day.date)}
      onMouseLeave={() => onHover(null)}
      className={`relative flex flex-col p-2 sm:p-2.5 transition-all min-h-[3.2rem] sm:min-h-[4rem] rounded-xl sm:rounded-2xl border ${textClasses} ${stateClasses} group overflow-hidden`}
      aria-label={format(day.date, "EEEE, MMMM d, yyyy")}
    >
      <span className="absolute top-1.5 left-2 sm:top-3 sm:left-4 text-xs sm:text-sm">{format(day.date, "d")}</span>
      
      {isActuallyToday && !selectedEdge && (
        <span className="absolute top-1.5 right-2 sm:top-3 sm:right-4 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-accent animate-pulse" />
      )}

      {(() => {
        if (!note) return null;
        const { combined, display } = parseNotePayload(note);
        if (!display.trim()) return null;
        
        const icon = getNoteIcon(combined);
        const hasEmojiInText = ["🎂", "🕘", "🚨", "🧳", "🎯", "📈", "📌"].some(e => display.includes(e));
        
        return (
          <div className="mt-auto text-[7px] sm:text-[9px] leading-tight text-left truncate flex flex-col gap-[1px]">
            {!hasEmojiInText && icon && <span className="mb-[1px] opacity-80 scale-75 sm:scale-100 origin-left">{icon}</span>}
            <span className="truncate w-full font-black opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
              <span className="sm:inline hidden">{display}</span>
              <span className="inline sm:hidden">{display.charAt(0)}</span>
            </span>
          </div>
        );
      })()}

      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}, (prev, next) => {
  return (
    prev.day.date.getTime() === next.day.date.getTime() &&
    prev.day.inCurrentMonth === next.day.inCurrentMonth &&
    prev.day.isToday === next.day.isToday &&
    prev.isStart === next.isStart &&
    prev.isEnd === next.isEnd &&
    prev.isInRange === next.isInRange &&
    prev.note === next.note
  );
});

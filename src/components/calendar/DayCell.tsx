"use client";

import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { CalendarDay } from "@/types/calendar";
import { memo } from "react";

/** Shared hover / focus glass treatment for date cells (non-selected default state). */
const glassDateHover =
  "hover:border-white/85 hover:bg-white/55 hover:backdrop-blur-xl hover:shadow-lg hover:shadow-black/15 hover:ring-1 hover:ring-white/40 focus-visible:border-white/85 focus-visible:bg-white/55 focus-visible:backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-white/50";

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

function parseNotePayload(noteRaw: string) {
  let combined = noteRaw;
  let display = noteRaw;
  try {
    const data = JSON.parse(noteRaw);
    combined = (data.events || "") + " " + (data.reminders?.map((r:any) => r.text).join(" ") || "") + " " + (data.goals?.map((g:any) => g.text).join(" ") || "");
    display = data.events || (data.reminders?.[0]?.text) || (data.goals?.[0]?.text) || "";
  } catch(e) {}
  return { combined, display };
}

function getNoteIcon(combinedText: string) {
  const lower = combinedText.toLowerCase();
  if (lower.includes("birthday") || lower.includes("cake") || lower.includes("🎂")) return "🎂";
  if (lower.includes("meeting") || lower.includes("time") || lower.includes("call") || lower.includes("🕘")) return "🕘";
  if (lower.includes("reminder") || lower.includes("critical") || lower.includes("urgent") || lower.includes("🚨")) return "🚨";
  if (lower.includes("trip") || lower.includes("travel") || lower.includes("flight") || lower.includes("🧳")) return "🧳";
  if (lower.includes("goal") || lower.includes("target") || lower.includes("🎯")) return "🎯";
  if (lower.includes("traffic") || lower.includes("peak") || lower.includes("📈")) return "📈";
  return "📌";
}

export const DayCell = memo(function DayCell({
  day,
  isStart,
  isEnd,
  isInRange,
  onSelect,
  onHover,
  motionVariants,
  note,
}: DayCellProps) {
  const selectedEdge = isStart || isEnd;
  
  const textClasses = day.inCurrentMonth
    ? day.isWeekend ? "text-[#3f4a7c] font-semibold" : "text-slate-400 font-medium"
    : "text-slate-200 font-medium opacity-40";

  const neumoClasses = day.isWeekend 
    ? "bg-[#b6c2e8]"
    : "border-[1.5px] border-[#cbd5e1]/50 bg-transparent";

  const stateClasses = (() => {
    if (selectedEdge) {
      return "text-white bg-[#475569] shadow-md font-bold scale-110";
    }
    if (isInRange) {
      return "text-slate-800 bg-slate-200 shadow-inner";
    }
    return neumoClasses;
  })();

  const todayIndicator = day.isToday && !selectedEdge ? (
    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-slate-800" />
  ) : null;

  return (
    <motion.button
      type="button"
      variants={motionVariants}
      onClick={() => onSelect(day.date)}
      onMouseEnter={() => onHover(day.date)}
      onMouseLeave={() => onHover(null)}
      className={`relative flex flex-col p-2 text-sm transition-all min-h-[4rem] sm:min-h-[4.5rem] rounded-xl ${textClasses} ${stateClasses} hover:scale-[1.02] active:scale-95`}
      aria-label={format(day.date, "EEEE, MMMM d, yyyy")}
    >
      <span className="absolute top-2 left-3 text-[13px]">{format(day.date, "d")}</span>
      {todayIndicator}
      {(() => {
        if (!note) return null;
        const { combined, display } = parseNotePayload(note);
        if (!display.trim()) return null;
        
        const icon = getNoteIcon(combined);
        const hasEmojiInText = ["🎂", "🕘", "🚨", "🧳", "🎯", "📈", "📌"].some(e => display.includes(e));
        
        return (
          <div className="absolute bottom-1.5 left-2 right-2 text-[9px] leading-tight text-left text-slate-700 truncate flex flex-col gap-[1px]">
            {!hasEmojiInText && <span className="opacity-90 grayscale-[0.2] mb-[1px]">{icon}</span>}
            <span className="truncate w-full font-semibold">{display}</span>
          </div>
        );
      })()}
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



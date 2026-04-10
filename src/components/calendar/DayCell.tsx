"use client";

import { format } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { CalendarDay } from "@/types/calendar";

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
}

export function DayCell({
  day,
  isStart,
  isEnd,
  isInRange,
  onSelect,
  onHover,
  motionVariants,
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
    </motion.button>
  );
}



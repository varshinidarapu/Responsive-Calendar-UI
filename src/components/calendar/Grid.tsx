"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { CalendarDay } from "@/types/calendar";
import { dayCellVariants, gridMonthContainer } from "@/lib/motion";
import { DayCell } from "./DayCell";

import { format } from "date-fns";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface GridProps {
  days: CalendarDay[];
  monthKey: string;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  isInRange: (date: Date) => boolean;
  onDayClick: (date: Date) => void;
  onHoverDay: (date: Date | null) => void;
  notes: Record<string, string>;
}

export function Grid({
  days,
  monthKey,
  isRangeStart,
  isRangeEnd,
  isInRange,
  onDayClick,
  onHoverDay,
  notes,
}: GridProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section aria-label="Monthly calendar">
      <div className="mb-[6px] grid grid-cols-7 text-center text-[12px] font-semibold">
        {WEEK_DAYS.map((day) => {
          const isWeekend = day === "Sat" || day === "Sun";
          return (
            <div key={day} className="flex justify-center px-1">
              {isWeekend ? (
                <div className="bg-[#b6c2e8] text-[#3f4a7c] w-full rounded-[14px] py-[6px] shadow-sm font-semibold">{day}</div>
              ) : (
                <div className="text-[#475569] font-medium py-[6px]">{day}</div>
              )}
            </div>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={monthKey}
          variants={gridMonthContainer(!!reducedMotion)}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid grid-cols-7 gap-2 sm:gap-3 md:gap-4"
        >
          {days.map((day) => (
            <DayCell
              key={day.date.toISOString()}
              day={day}
              isStart={isRangeStart(day.date)}
              isEnd={isRangeEnd(day.date)}
              isInRange={isInRange(day.date)}
              onSelect={onDayClick}
              onHover={onHoverDay}
              motionVariants={dayCellVariants(!!reducedMotion)}
              note={notes[format(day.date, "yyyy-MM-dd")] || ""}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import type { CalendarDay } from "@/types/calendar";
import { DayCell } from "./DayCell";
import { gridContainer, dayCellSlide } from "@/lib/motion";

interface GridProps {
  days: CalendarDay[];
  monthKey: string;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  isInRange: (date: Date) => boolean;
  onDayClick: (date: Date) => void;
  onHoverDay: (date: Date | null) => void;
  notes?: Record<string, string>;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function Grid({
  days,
  monthKey,
  isRangeStart,
  isRangeEnd,
  isInRange,
  onDayClick,
  onHoverDay,
  notes = {},
}: GridProps) {
  return (
    <div className="flex flex-col flex-1">
      {/* Grid Header */}
      <div className="grid grid-cols-7 mb-2 sm:mb-4">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 py-2">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day[0]}</span>
          </div>
        ))}
      </div>

      {/* Grid Content */}
      <motion.div
        key={monthKey}
        variants={gridContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-7 gap-1.5 sm:gap-4 flex-1"
      >
        {days.map((day, i) => {
          const dateStr = format(day.date, "yyyy-MM-dd");
          return (
            <DayCell
              key={dateStr + i}
              day={day}
              isStart={isRangeStart(day.date)}
              isEnd={isRangeEnd(day.date)}
              isInRange={isInRange(day.date)}
              onSelect={onDayClick}
              onHover={onHoverDay}
              motionVariants={dayCellSlide}
              note={notes[dateStr]}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

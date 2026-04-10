"use client";

import Image from "next/image";
import { format } from "date-fns";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useMemo, useState } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useRangeSelection } from "@/hooks/useRangeSelection";
import { getHeroImageSrcForMonth } from "@/lib/monthHero";
import { pageEnter, springGentle } from "@/lib/motion";
import { Grid } from "./Grid";
import { Header } from "./Header";
import { NotesPanel } from "./NotesPanel";

const MONTH_NOTES_STORAGE = "wall-calendar:month-notes";
const RANGE_NOTES_STORAGE = "wall-calendar:range-notes";

function rangeKey(start: Date | null, end: Date | null): string {
  if (!start) {
    return "";
  }
  const s = format(start, "yyyy-MM-dd");
  if (!end || s === format(end, "yyyy-MM-dd")) {
    return s;
  }
  return `${s}__${format(end, "yyyy-MM-dd")}`;
}

function rangeLabel(start: Date | null, end: Date | null): string {
  if (!start) {
    return "";
  }
  if (!end || format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd")) {
    return format(start, "PPP");
  }
  return `${format(start, "PPP")} - ${format(end, "PPP")}`;
}

function Spiral() {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex justify-center gap-1 px-4 sm:gap-3 sm:px-10">
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} className="spiral-ring -translate-y-1/2 scale-75" />
      ))}
    </div>
  );
}

export function Calendar() {
  const reducedMotion = useReducedMotion();
  const { currentMonth, days, monthLabel, monthKey, previousMonth, nextMonth } =
    useCalendar();
  const {
    range,
    onDayClick,
    setHoverDate,
    isInRange,
    isRangeStart,
    isRangeEnd,
  } = useRangeSelection();

  const heroSrc = useMemo(() => getHeroImageSrcForMonth(currentMonth), [currentMonth]);
  const heroAlt = `Seasonal illustration for ${format(currentMonth, "MMMM yyyy")}`;

  // State management for notes
  const [monthNote, setMonthNote] = useState("");
  const [rangeNote, setRangeNote] = useState("");

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="calendar-frame"
    >
      <Spiral />

      {/* Hero Section */}
      <div className="relative h-[24vh] min-h-[160px] max-h-[300px] w-full shrink-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={monthKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/10" />
            
            {/* Quote / Overlay */}
            <div className="absolute inset-x-0 bottom-6 sm:bottom-12 flex flex-col items-center px-6 text-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              <p className="max-w-3xl text-2xl font-serif font-black sm:text-4xl" style={{ textShadow: "1px 2px 4px rgba(0,0,0,0.5)" }}>
                Every new day is another chance <br className="hidden sm:block" /> to change your life.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col-reverse xl:flex-row flex-1 p-4 md:p-8 gap-6 md:gap-10 bg-[#f4f5f6] rounded-b-2xl">
        {/* Sidebar: Notes */}
        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
          <NotesPanel
            monthNote={monthNote}
            rangeNote={rangeNote}
            rangeLabel={range.start ? format(range.start, "PPP") : ""}
            onMonthNoteChange={setMonthNote}
            onRangeNoteChange={setRangeNote}
          />
        </div>

        {/* Center: Calendar */}
        <div className="flex flex-1 flex-col relative w-full pt-2">
          <div className="w-full h-full flex flex-col">
            <Header monthLabel={monthLabel} onPrev={previousMonth} onNext={nextMonth} />
            <Grid
              days={days}
              monthKey={monthKey}
              isRangeStart={isRangeStart}
              isRangeEnd={isRangeEnd}
              isInRange={isInRange}
              onDayClick={onDayClick}
              onHoverDay={setHoverDate}
            />
          </div>
        </div>
      </div>
    </motion.main>
  );
}




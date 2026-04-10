"use client";

import Image from "next/image";
import { format } from "date-fns";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useRangeSelection } from "@/hooks/useRangeSelection";
import { getHeroImageSrcForMonth } from "@/lib/monthHero";
import { pageEnter, springGentle } from "@/lib/motion";
import { Grid } from "./Grid";
import { Header } from "./Header";
import { NotesPanel } from "./NotesPanel";

const MONTH_NOTES_STORAGE = "wall-calendar:month-notes";
const RANGE_NOTES_STORAGE = "wall-calendar:range-notes";

const MONTH_QUOTES = [
  "Every moment is a fresh beginning.",
  "Where there is love there is life.",
  "Spring adds new life and new beauty to all that is.",
  "The earth laughs in flowers.",
  "Keep your face always toward the sunshine—and shadows will fall behind you.",
  "Live in the sunshine, swim the sea, drink the wild air.",
  "Freedom lies in being bold.",
  "Do what you can, with what you have, where you are.",
  "And then the sun took a step back, the leaves lulled themselves to sleep, and autumn was awakened.",
  "Life starts all over again when it gets crisp in the fall.",
  "Gratitude turns what we have into enough.",
  "Joy is what happens to us when we allow ourselves to recognize how good things really are."
];

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
    return format(start, "MMMM do, yyyy");
  }
  return `${format(start, "MMMM do, yyyy")} - ${format(end, "MMMM do, yyyy")}`;
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
    clearRange,
  } = useRangeSelection();

  const heroSrc = useMemo(() => getHeroImageSrcForMonth(currentMonth), [currentMonth]);
  const heroAlt = `Seasonal illustration for ${format(currentMonth, "MMMM yyyy")}`;
  const currentQuote = MONTH_QUOTES[currentMonth.getMonth()] || MONTH_QUOTES[0];

  // State management for notes
  const currentRangeKey = useMemo(() => rangeKey(range.start, range.end), [range.start, range.end]);
  const [monthNotes, setMonthNotes] = useState<Record<string, string>>({});
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});

  // Load from storage on mount
  useEffect(() => {
    try {
      const storedMonth = localStorage.getItem(MONTH_NOTES_STORAGE);
      if (storedMonth) setMonthNotes(JSON.parse(storedMonth));
      
      const storedRange = localStorage.getItem(RANGE_NOTES_STORAGE);
      if (storedRange) setRangeNotes(JSON.parse(storedRange));
    } catch (e) {}
  }, []);

  // Clear date selection mathematically whenever the user pages to a new month panel
  useEffect(() => {
    clearRange();
  }, [monthKey, clearRange]);

  const handleMonthNoteChange = (value: string) => {
    const updated = { ...monthNotes, [monthKey]: value };
    setMonthNotes(updated);
    localStorage.setItem(MONTH_NOTES_STORAGE, JSON.stringify(updated));
  };

  const handleRangeNoteChange = (value: string) => {
    if (!currentRangeKey) return;
    const updated = { ...rangeNotes, [currentRangeKey]: value };
    setRangeNotes(updated);
    localStorage.setItem(RANGE_NOTES_STORAGE, JSON.stringify(updated));
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="calendar-frame"
    >
      <Spiral />

      {/* Hero Section */}
      <div className="relative h-[24vh] min-h-[160px] max-h-[300px] w-full shrink-0 overflow-hidden" style={{ perspective: "1500px" }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={monthKey}
            initial={reducedMotion ? { opacity: 0 } : { rotateX: 90, opacity: 0, y: -20 }}
            animate={reducedMotion ? { opacity: 1 } : { rotateX: 0, opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { rotateX: -90, opacity: 0, y: 20 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
            className="absolute inset-0 origin-top"
          >
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover pointer-events-none"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Quote / Overlay */}
            <div className="absolute inset-x-0 bottom-6 sm:bottom-12 flex flex-col items-center px-6 text-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              <p className="max-w-3xl text-xl sm:text-3xl font-serif font-bold italic" style={{ textShadow: "1px 2px 4px rgba(0,0,0,0.5)" }}>
                “{currentQuote}”
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col-reverse xl:flex-row flex-1 p-4 md:p-8 gap-6 md:gap-10 bg-[#f4f5f6] rounded-b-2xl w-full">
        {/* Sidebar: Notes */}
        <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-6">
          <NotesPanel
            monthNote={monthNotes[monthKey] || ""}
            rangeNote={rangeNotes[currentRangeKey] || ""}
            rangeLabel={rangeLabel(range.start, range.end)}
            onMonthNoteChange={handleMonthNoteChange}
            onRangeNoteChange={handleRangeNoteChange}
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
              notes={rangeNotes}
            />
          </div>
        </div>
      </div>
    </motion.main>
  );
}




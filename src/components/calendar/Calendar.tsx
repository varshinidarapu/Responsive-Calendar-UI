"use client";

import Image from "next/image";
import { format, isSameDay } from "date-fns";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState, useEffect, useCallback } from "react";
import { useCalendar } from "@/hooks/useCalendar";
import { useRangeSelection } from "@/hooks/useRangeSelection";
import { getHeroImageSrcForMonth } from "@/lib/monthHero";
import { Grid } from "./Grid";
import { Header } from "./Header";
import { NotesPanel } from "./NotesPanel";

const MONTH_NOTES_STORAGE = "wall-calendar:month-notes";
const RANGE_NOTES_STORAGE = "wall-calendar:range-notes";
const THEME_STORAGE = "wall-calendar:theme";

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
  if (!start) return "";
  const s = format(start, "yyyy-MM-dd");
  if (!end || s === format(end, "yyyy-MM-dd")) return s;
  return `${s}__${format(end, "yyyy-MM-dd")}`;
}

function rangeLabel(start: Date | null, end: Date | null): string {
  if (!start) return "";
  if (!end || format(start, "yyyy-MM-dd") === format(end, "yyyy-MM-dd")) {
    return format(start, "MMMM do, yyyy");
  }
  return `${format(start, "MMMM do, yyyy")} - ${format(end, "MMMM do, yyyy")}`;
}

function Spiral({ monthKey }: { monthKey: string }) {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex justify-center gap-1.5 px-10 sm:gap-4 sm:px-24" style={{ perspective: "1200px" }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div 
          key={monthKey + i}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: [0, 180, 360] }}
          transition={{ duration: 0.7, delay: i * 0.015, ease: "easeInOut" }}
          className="relative origin-center" 
        >
          <div className="spiral-ring -translate-y-1/2" />
        </motion.div>
      ))}
    </div>
  );
}

export function Calendar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { currentMonth, days, monthLabel, monthKey, previousMonth, nextMonth, goToToday } = useCalendar();
  const { range, onDayClick, setHoverDate, isInRange, isRangeStart, isRangeEnd, clearRange } = useRangeSelection();

  const heroSrc = useMemo(() => getHeroImageSrcForMonth(currentMonth), [currentMonth]);
  const currentQuote = MONTH_QUOTES[currentMonth.getMonth()] || MONTH_QUOTES[0];

  const currentRangeKey = useMemo(() => rangeKey(range.start, range.end), [range.start, range.end]);
  const [monthNotes, setMonthNotes] = useState<Record<string, string>>({});
  const [rangeNotes, setRangeNotes] = useState<Record<string, string>>({});

  // Theme Sync
  useEffect(() => {
    const saved = localStorage.getItem(THEME_STORAGE) as "light" | "dark";
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_STORAGE, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => t === "light" ? "dark" : "light");
  }, []);

  useEffect(() => {
    const storedMonth = localStorage.getItem(MONTH_NOTES_STORAGE);
    if (storedMonth) setMonthNotes(JSON.parse(storedMonth));
    const storedRange = localStorage.getItem(RANGE_NOTES_STORAGE);
    if (storedRange) setRangeNotes(JSON.parse(storedRange));
  }, []);

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

  const isSelectedToday = useMemo(() => {
    return range.start && isSameDay(range.start, new Date());
  }, [range.start]);

  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="calendar-frame"
    >
      <Spiral monthKey={monthKey} />

      {/* Hero Section */}
      <div className="relative h-[20vh] min-h-[160px] max-h-[300px] w-full shrink-0 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={monthKey}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Image
              src={heroSrc}
              alt={monthLabel}
              fill
              className="object-cover brightness-75 transition-all duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            <div className="absolute top-6 right-8 z-10 flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                {theme === "light" ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M3 12h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="absolute top-8 left-8 flex flex-col gap-1 text-white/90">
               <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg">{monthLabel}</h1>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col xl:flex-row flex-1 p-6 md:p-8 gap-8 w-full bg-background transition-colors duration-500 overflow-hidden" style={{ perspective: "2000px" }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={monthKey}
            initial={{ rotateX: 25, opacity: 0, transformOrigin: "top" }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: -25, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col xl:flex-row h-full w-full gap-8"
          >
            {/* Left Column: Daily Notes (Mobile: Order 2) */}
            <div className="w-full xl:w-[320px] 2xl:w-[360px] shrink-0 order-2 xl:order-1">
              <NotesPanel
                viewMode="left"
                monthNote={monthNotes[monthKey] || ""}
                rangeNote={rangeNotes[currentRangeKey] || ""}
                rangeLabel={rangeLabel(range.start, range.end)}
                isToday={isSelectedToday}
                onMonthNoteChange={handleMonthNoteChange}
                onRangeNoteChange={handleRangeNoteChange}
              />
            </div>

            {/* Center: Calendar Grid (Mobile: Order 1) */}
            <div className="flex flex-1 flex-col order-1 xl:order-2">
              <Header 
                monthLabel={monthLabel} 
                onPrev={previousMonth} 
                onNext={nextMonth} 
                onToday={goToToday}
              />
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

            {/* Right Column: Planner (Mobile: Order 3) */}
            <div className="w-full xl:w-[320px] 2xl:w-[360px] shrink-0 order-3 xl:order-3">
              <NotesPanel
                viewMode="right"
                monthNote={monthNotes[monthKey] || ""}
                rangeNote={rangeNotes[currentRangeKey] || ""}
                rangeLabel={rangeLabel(range.start, range.end)}
                isToday={isSelectedToday}
                onMonthNoteChange={handleMonthNoteChange}
                onRangeNoteChange={handleRangeNoteChange}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.main>
  );
}

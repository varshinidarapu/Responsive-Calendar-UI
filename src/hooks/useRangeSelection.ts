"use client";

import { useMemo, useState, useCallback } from "react";
import { isAfter, isBefore, isSameDay } from "date-fns";
import type { DateRange } from "@/types/calendar";

export function useRangeSelection() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const previewRange = useMemo<DateRange>(() => {
    return range; // Ignore hover range previews
  }, [range]);

  const onDayClick = useCallback((date: Date) => {
    setRange((prev) => {
      // Toggle off if clicking the exact already selected date
      if (prev.start && isSameDay(date, prev.start)) {
        return { start: null, end: null };
      }

      // Always select exactly one isolated day
      return { start: date, end: date };
    });
  }, []);

  const isRangeStart = (date: Date) =>
    Boolean(range.start && isSameDay(range.start, date));
  const isRangeEnd = (date: Date) =>
    Boolean(range.start && isSameDay(range.start, date));

  const isInRange = (date: Date) => {
    return isRangeStart(date);
  };

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
  }, []);

  return {
    range,
    hoverDate,
    onDayClick,
    setHoverDate,
    clearRange,
    isRangeStart,
    isRangeEnd,
    isInRange,
  };
}

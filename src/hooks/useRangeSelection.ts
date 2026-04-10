"use client";

import { useMemo, useState, useCallback } from "react";
import { isAfter, isBefore, isSameDay } from "date-fns";
import type { DateRange } from "@/types/calendar";

export function useRangeSelection() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const previewRange = useMemo<DateRange>(() => {
    if (range.start && !range.end && hoverDate) {
      if (isBefore(hoverDate, range.start)) {
        return { start: hoverDate, end: range.start };
      }
      return { start: range.start, end: hoverDate };
    }
    return range;
  }, [range, hoverDate]);

  const onDayClick = useCallback((date: Date) => {
    setRange((prev) => {
      // Toggle off if clicking the exact already selected date
      if (prev.start && isSameDay(date, prev.start) && !prev.end) {
        return { start: null, end: null };
      }

      // If we don't have a start, or we already have both, start a new range
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      }

      // We have a start but no end.
      if (isBefore(date, prev.start)) {
        return { start: date, end: prev.start };
      }
      return { start: prev.start, end: date };
    });
  }, []);

  const isRangeStart = (date: Date) =>
    Boolean(previewRange.start && isSameDay(previewRange.start, date));
  const isRangeEnd = (date: Date) =>
    Boolean(previewRange.end && isSameDay(previewRange.end, date));

  const isInRange = (date: Date) => {
    if (!previewRange.start || !previewRange.end) return false;
    return (
      (isAfter(date, previewRange.start) || isSameDay(date, previewRange.start)) &&
      (isBefore(date, previewRange.end) || isSameDay(date, previewRange.end))
    );
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

"use client";

import { useMemo, useState } from "react";
import { isAfter, isBefore, isSameDay } from "date-fns";
import type { DateRange } from "@/types/calendar";

export function useRangeSelection() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const previewRange = useMemo<DateRange>(() => {
    if (!range.start || range.end || !hoverDate) {
      return range;
    }

    if (isBefore(hoverDate, range.start)) {
      return { start: hoverDate, end: range.start };
    }

    return { start: range.start, end: hoverDate };
  }, [range, hoverDate]);

  const onDayClick = (date: Date) => {
    setRange((prev) => {
      // Toggle off if clicking the same start date and no end is set
      if (prev.start && !prev.end && isSameDay(date, prev.start)) {
        return { start: null, end: null };
      }

      // If starting fresh or a range was already complete
      if (!prev.start || prev.end) {
        return { start: date, end: null };
      }

      // If selecting an end date that is before the start date, swap them
      if (isBefore(date, prev.start)) {
        return { start: date, end: prev.start };
      }

      // Normal range completion
      return { start: prev.start, end: date };
    });
  };

  const isRangeStart = (date: Date) =>
    Boolean(previewRange.start && isSameDay(previewRange.start, date));
  const isRangeEnd = (date: Date) =>
    Boolean(previewRange.end && isSameDay(previewRange.end, date));

  const isInRange = (date: Date) => {
    if (!previewRange.start || !previewRange.end) {
      return false;
    }

    if (isRangeStart(date) || isRangeEnd(date)) {
      return true;
    }

    return isAfter(date, previewRange.start) && isBefore(date, previewRange.end);
  };

  return {
    range,
    hoverDate,
    onDayClick,
    setHoverDate,
    clearRange: () => setRange({ start: null, end: null }),
    isRangeStart,
    isRangeEnd,
    isInRange,
  };
}

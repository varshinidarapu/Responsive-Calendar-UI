"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isWeekend,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { CalendarDay } from "@/types/calendar";

export function useCalendar(initialDate: Date = new Date()) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialDate));

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const result: CalendarDay[] = [];
    const cursor = new Date(calendarStart);

    while (cursor <= calendarEnd) {
      result.push({
        date: new Date(cursor),
        inCurrentMonth: cursor.getMonth() === currentMonth.getMonth(),
        isToday: isSameDay(cursor, new Date()),
        isWeekend: isWeekend(cursor),
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  }, [currentMonth]);

  return {
    currentMonth,
    days,
    monthLabel: format(currentMonth, "MMMM yyyy"),
    monthKey: format(currentMonth, "yyyy-MM"),
    previousMonth: () => setCurrentMonth((value) => addMonths(value, -1)),
    nextMonth: () => setCurrentMonth((value) => addMonths(value, 1)),
  };
}

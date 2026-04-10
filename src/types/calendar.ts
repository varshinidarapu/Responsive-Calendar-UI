export interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

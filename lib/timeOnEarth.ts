import { BIO } from "../config/bio.ts";

export interface TimeOnEarthBreakdown {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalWeeks: number;
  decimalYears: string;
  daysToNextBirthday: number;
  isBirthday: boolean;
  ageYears: number; // Age attained on birthday or current age
}

export interface ISTDateParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
  ms: number;
}

/**
 * Extract date parts in Asia/Kolkata (IST = UTC+05:30)
 */
export function getISTParts(timestamp: number): ISTDateParts {
  const istOffsetMs = BIO.timeZoneOffsetMinutes * 60 * 1000;
  const d = new Date(timestamp + istOffsetMs);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1, // 1-indexed (1-12)
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    ms: d.getUTCMilliseconds(),
  };
}

/**
 * Returns the number of days in a given Gregorian month (month: 1-12).
 */
export function daysInMonth(year: number, month: number): number {
  // Day 0 of next month returns the last day of the current month
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

/**
 * Calculates exact Time on Earth metrics relative to DOB in Asia/Kolkata timezone.
 * Drift-free calculation directly comparing `nowMs` against `dobMs`.
 */
export function calculateTimeOnEarth(
  nowMs: number = Date.now(),
  dobMs: number = BIO.dobTimestamp
): TimeOnEarthBreakdown {
  const elapsedMs = Math.max(0, nowMs - dobMs);
  const totalDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
  const totalWeeks = Math.floor(totalDays / 7);

  // Average Gregorian year length = 365.2425 days
  const decimalYears = (elapsedMs / (365.2425 * 24 * 60 * 60 * 1000)).toFixed(4);

  const dob = getISTParts(dobMs);
  const now = getISTParts(nowMs);

  let years = now.year - dob.year;
  let months = now.month - dob.month;
  let days = now.day - dob.day;
  let hours = now.hour - dob.hour;
  let minutes = now.minute - dob.minute;
  let seconds = now.second - dob.second;

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    // Borrow days from the previous month
    let prevMonth = now.month - 1;
    let prevYear = now.year;
    if (prevMonth < 1) {
      prevMonth = 12;
      prevYear -= 1;
    }
    days += daysInMonth(prevYear, prevMonth);
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  // DOB is Nov 29 (month: 11, day: 29)
  const isBirthday = now.month === 11 && now.day === 29;

  // Next birthday calculation:
  // If today is birthday, next birthday is 365 (or 366) days away in next year
  const targetYear =
    now.month === 11 && now.day === 29
      ? now.year + 1
      : now.month > 11 || (now.month === 11 && now.day > 29)
      ? now.year + 1
      : now.year;

  const todayISTDateMs = Date.UTC(now.year, now.month - 1, now.day);
  const nextBdayISTDateMs = Date.UTC(targetYear, 10, 29); // Month 10 is November in Date.UTC (0-indexed)
  const daysToNextBirthday = Math.round(
    (nextBdayISTDateMs - todayISTDateMs) / (24 * 60 * 60 * 1000)
  );

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays,
    totalWeeks,
    decimalYears,
    daysToNextBirthday,
    isBirthday,
    ageYears: years + (isBirthday ? 0 : 0), // When years rolled on birthday, years is the attained age
  };
}

/**
 * Returns a human-friendly narrative for aria-label (screen readers).
 */
export function formatAriaDescription(b: TimeOnEarthBreakdown): string {
  if (b.isBirthday) {
    return `Today is Aditya's birthday! Day 1 of year ${b.years}. Lived ${b.totalDays.toLocaleString()} days on Earth.`;
  }
  return `Aditya has lived ${b.years} years, ${b.months} months, ${b.days} days, ${b.hours} hours, ${b.minutes} minutes, and ${b.seconds} seconds on Earth. Next birthday in ${b.daysToNextBirthday} days.`;
}

/**
 * Returns formatted text for the low-frequency polite live region (updates at most 1/min).
 */
export function formatPoliteLiveText(b: TimeOnEarthBreakdown): string {
  return `${b.years}y ${b.months}m ${b.days}d · ${b.hours}h ${b.minutes}m lived · Next birthday in ${b.daysToNextBirthday} days`;
}

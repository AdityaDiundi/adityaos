import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateTimeOnEarth,
  getISTParts,
  daysInMonth,
  formatAriaDescription,
} from "../lib/timeOnEarth.ts";
import { BIO } from "../config/bio.ts";

test("Time on Earth - Core Test Case: 2026-11-10 12:00:00 IST", () => {
  // 2026-11-10T12:00:00+05:30 -> UTC is 2026-11-10T06:30:00.000Z
  const targetMs = new Date("2026-11-10T12:00:00+05:30").getTime();
  const res = calculateTimeOnEarth(targetMs);

  assert.strictEqual(res.years, 28, "Should evaluate to 28 full years");
  assert.strictEqual(res.months, 11, "Should evaluate to 11 full months");
  assert.strictEqual(res.days, 12, "Should evaluate to 12 days");
  assert.strictEqual(res.hours, 12, "Should evaluate to 12 hours");
  assert.strictEqual(res.minutes, 0, "Should evaluate to 0 minutes");
  assert.strictEqual(res.seconds, 0, "Should evaluate to 0 seconds");
  assert.strictEqual(res.totalDays, 10573, "Should evaluate to 10573 days elapsed");
  assert.strictEqual(res.daysToNextBirthday, 19, "Next birthday in exactly 19 days (Nov 29 - Nov 10)");
  assert.strictEqual(res.isBirthday, false, "Not birthday on Nov 10");
});

test("Time on Earth - Birthday Boundary: 2026-11-29 00:00:00 IST", () => {
  // Midnight on 29th birthday
  const bdayMs = new Date("2026-11-29T00:00:00+05:30").getTime();
  const res = calculateTimeOnEarth(bdayMs);

  assert.strictEqual(res.years, 29, "Turns exactly 29 years old");
  assert.strictEqual(res.months, 0, "0 months");
  assert.strictEqual(res.days, 0, "0 days");
  assert.strictEqual(res.hours, 0, "0 hours");
  assert.strictEqual(res.minutes, 0, "0 minutes");
  assert.strictEqual(res.seconds, 0, "0 seconds");
  assert.strictEqual(res.isBirthday, true, "isBirthday must be true");
  assert.strictEqual(res.totalDays, 10592, "Total days lived reaches 10,592");
});

test("Time on Earth - Day before birthday: 2026-11-28 23:59:59 IST", () => {
  const eveMs = new Date("2026-11-28T23:59:59+05:30").getTime();
  const res = calculateTimeOnEarth(eveMs);

  assert.strictEqual(res.years, 28, "Still 28 years old");
  assert.strictEqual(res.months, 11, "11 months");
  assert.strictEqual(res.days, 30, "30 days past 2025-11-29 (October had 31 days)");
  assert.strictEqual(res.daysToNextBirthday, 1, "Next birthday is in 1 day");
  assert.strictEqual(res.isBirthday, false, "Not yet birthday");
});

test("Time on Earth - IST vs UTC midnight alignment", () => {
  // When UTC is 2026-11-09T18:30:00Z, IST is 2026-11-10T00:00:00+05:30 (start of Nov 10)
  const istMidnightMs = Date.UTC(2026, 10, 9, 18, 30, 0);
  const istParts = getISTParts(istMidnightMs);
  assert.strictEqual(istParts.day, 10, "IST date is Nov 10 at 18:30 UTC");
  assert.strictEqual(istParts.hour, 0, "IST hour is 0 at 18:30 UTC");
  assert.strictEqual(istParts.minute, 0, "IST minute is 0 at 18:30 UTC");

  // When UTC is 2026-11-10T00:00:00Z, IST is 2026-11-10T05:30:00+05:30 (5.5 hours into Nov 10)
  const utcMidnightMs = Date.UTC(2026, 10, 10, 0, 0, 0);
  const istPartsAtUtcMidnight = getISTParts(utcMidnightMs);
  assert.strictEqual(istPartsAtUtcMidnight.day, 10, "IST day remains 10");
  assert.strictEqual(istPartsAtUtcMidnight.hour, 5, "IST hour is 5");
  assert.strictEqual(istPartsAtUtcMidnight.minute, 30, "IST minute is 30");
});

test("Time on Earth - Leap year handling (Feb 29 in 2024 and 2028)", () => {
  assert.strictEqual(daysInMonth(2024, 2), 29, "2024 is a leap year (29 days in Feb)");
  assert.strictEqual(daysInMonth(2025, 2), 28, "2025 is a common year (28 days in Feb)");
  assert.strictEqual(daysInMonth(2028, 2), 29, "2028 is a leap year (29 days in Feb)");

  // Check rollover across Feb 29 in leap year 2024
  const marchFirstLeap = new Date("2024-03-01T00:00:00+05:30").getTime();
  const resLeap = calculateTimeOnEarth(marchFirstLeap);
  // DOB 1997-11-29 to 2023-11-29 = 26y. Dec (month 1), Jan (month 2), Feb (month 3).
  // In 2024 leap year, Feb had 29 days, from 2024-02-29 to 2024-03-01 is 1 day.
  assert.strictEqual(resLeap.years, 26);
  assert.strictEqual(resLeap.months, 3);
  assert.strictEqual(resLeap.days, 1);
});

test("Time on Earth - Month rollovers (30-day, 31-day, 28-day months)", () => {
  // Test day 1 after 30-day month (e.g. April 30 -> May 1)
  const may1st = new Date("2026-05-01T00:00:00+05:30").getTime();
  const resMay = calculateTimeOnEarth(may1st);
  // Nov 29 to Apr 29 = 5 months. Apr has 30 days. Apr 29 -> Apr 30 (1) -> May 1 (2).
  assert.strictEqual(resMay.years, 28);
  assert.strictEqual(resMay.months, 5);
  assert.strictEqual(resMay.days, 2);
});

test("Time on Earth - Accessibility and Aria Label formatting", () => {
  const targetMs = new Date("2026-11-10T12:00:00+05:30").getTime();
  const res = calculateTimeOnEarth(targetMs);
  const aria = formatAriaDescription(res);
  assert.ok(aria.includes("28 years, 11 months, 12 days"));
  assert.ok(aria.includes("Next birthday in 19 days"));

  const bdayMs = new Date("2026-11-29T00:00:00+05:30").getTime();
  const bdayRes = calculateTimeOnEarth(bdayMs);
  const bdayAria = formatAriaDescription(bdayRes);
  assert.ok(bdayAria.includes("Day 1 of year 29"));
});

/**
 * Core biographical anchor configuration for Aditya Diwakar.
 * Anchor: DOB 29 Nov 1997, 00:00 Asia/Kolkata (IST midnight).
 * IST is UTC+05:30 -> 1997-11-28T18:30:00.000Z.
 */

export const BIO = {
  name: "Aditya Diwakar",
  role: "Design Technologist & Systems Architect",
  dobString: "1997-11-29T00:00:00+05:30",
  // 1997-11-28T18:30:00.000Z in milliseconds since Unix Epoch
  dobTimestamp: 880741800000,
  timeZone: "Asia/Kolkata",
  timeZoneOffsetMinutes: 330, // +05:30
  birthCity: "Jaipur, India",
} as const;

export type BioConfig = typeof BIO;

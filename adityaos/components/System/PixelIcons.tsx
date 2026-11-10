"use client";

import React from "react";

interface PixelIconProps {
  className?: string;
  size?: number;
}

/**
 * High-craft 16x16 / 24x24 pixel art icons rendered via crisp SVG rect grids.
 * Styled for the "Editorial Newspaper" theme with support for dark/light themes.
 */

// 1. Work / Shipped Projects (Pixel Briefcase / Portfolio Folio)
export function PixelWorkIcon({ className = "", size = 28 }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {/* Handle */}
      <rect x="9" y="3" width="6" height="2" fill="currentColor" />
      <rect x="8" y="4" width="2" height="2" fill="currentColor" />
      <rect x="14" y="4" width="2" height="2" fill="currentColor" />
      
      {/* Briefcase Body Outer Outline */}
      <rect x="3" y="6" width="18" height="15" fill="currentColor" />
      
      {/* Interior Fill */}
      <rect x="5" y="8" width="14" height="11" fill="var(--bg-canvas, #FAF7F2)" className="dark:fill-[#1A1814]" />
      
      {/* Front flap divider */}
      <rect x="4" y="11" width="16" height="2" fill="currentColor" />
      
      {/* Center Brass Lock / Latch */}
      <rect x="11" y="10" width="2" height="4" fill="#D97706" />
      
      {/* Leather accent corner patches */}
      <rect x="5" y="17" width="2" height="2" fill="#8C8273" opacity="0.6" />
      <rect x="17" y="17" width="2" height="2" fill="#8C8273" opacity="0.6" />
    </svg>
  );
}

// 2. Writing (Pixel Fountain Pen & Scroll)
export function PixelWritingIcon({ className = "", size = 28 }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {/* Pen Body (diagonal) */}
      <rect x="16" y="3" width="5" height="3" fill="#D97706" />
      <rect x="14" y="5" width="4" height="3" fill="currentColor" />
      <rect x="12" y="7" width="4" height="3" fill="currentColor" />
      <rect x="10" y="9" width="4" height="3" fill="#8C8273" />
      <rect x="8" y="11" width="4" height="3" fill="currentColor" />
      <rect x="6" y="13" width="4" height="3" fill="#D97706" />
      
      {/* Nib */}
      <rect x="5" y="15" width="3" height="3" fill="currentColor" />
      <rect x="3" y="17" width="3" height="3" fill="currentColor" />
      <rect x="2" y="19" width="2" height="2" fill="#10B981" />
      
      {/* Ink flourish / paper sheet background */}
      <rect x="11" y="14" width="9" height="7" fill="var(--bg-canvas, #FAF7F2)" className="dark:fill-[#1A1814]" />
      <rect x="12" y="13" width="8" height="1" fill="currentColor" />
      <rect x="20" y="14" width="1" height="7" fill="currentColor" />
      <rect x="11" y="21" width="10" height="1" fill="currentColor" />
      
      {/* Text lines on scroll */}
      <rect x="13" y="16" width="5" height="1" fill="#8C8273" />
      <rect x="13" y="18" width="4" height="1" fill="#8C8273" />
    </svg>
  );
}

// 3. About (Pixel Persona / Profile Silhouette)
export function PixelAboutIcon({ className = "", size = 28 }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {/* Hair / Head Outline */}
      <rect x="8" y="3" width="8" height="3" fill="currentColor" />
      <rect x="6" y="5" width="12" height="3" fill="currentColor" />
      <rect x="6" y="8" width="3" height="5" fill="currentColor" />
      
      {/* Face */}
      <rect x="9" y="7" width="9" height="6" fill="#FBBF24" opacity="0.85" />
      {/* Spectacles / Eyes */}
      <rect x="10" y="8" width="3" height="2" fill="currentColor" />
      <rect x="14" y="8" width="3" height="2" fill="currentColor" />
      <rect x="13" y="9" width="1" height="1" fill="currentColor" />
      
      {/* Chin / Neck */}
      <rect x="10" y="13" width="4" height="2" fill="#FBBF24" opacity="0.85" />
      
      {/* Collar / Shoulders */}
      <rect x="8" y="15" width="8" height="2" fill="currentColor" />
      <rect x="4" y="17" width="16" height="4" fill="currentColor" />
      <rect x="2" y="19" width="20" height="2" fill="currentColor" />
      
      {/* Tie / Pendant accent */}
      <rect x="11" y="17" width="2" height="4" fill="#10B981" />
    </svg>
  );
}

// 4. Resume (Pixel Document with folded corner and lines)
export function PixelResumeIcon({ className = "", size = 28 }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {/* Document border */}
      <rect x="4" y="3" width="11" height="1" fill="currentColor" />
      <rect x="4" y="4" width="1" height="17" fill="currentColor" />
      <rect x="4" y="20" width="16" height="1" fill="currentColor" />
      <rect x="19" y="8" width="1" height="13" fill="currentColor" />
      
      {/* Folded corner */}
      <rect x="15" y="3" width="1" height="1" fill="currentColor" />
      <rect x="16" y="4" width="1" height="1" fill="currentColor" />
      <rect x="17" y="5" width="1" height="1" fill="currentColor" />
      <rect x="18" y="6" width="1" height="1" fill="currentColor" />
      <rect x="19" y="7" width="1" height="1" fill="currentColor" />
      <rect x="15" y="4" width="4" height="4" fill="#D97706" />
      <rect x="14" y="4" width="1" height="4" fill="currentColor" />
      <rect x="14" y="8" width="6" height="1" fill="currentColor" />
      
      {/* Interior Page */}
      <rect x="5" y="4" width="9" height="16" fill="var(--bg-canvas, #FAF7F2)" className="dark:fill-[#1A1814]" />
      <rect x="14" y="9" width="5" height="11" fill="var(--bg-canvas, #FAF7F2)" className="dark:fill-[#1A1814]" />
      
      {/* Document header badge */}
      <rect x="7" y="6" width="5" height="2" fill="#10B981" />
      
      {/* Content lines */}
      <rect x="7" y="10" width="10" height="1" fill="currentColor" />
      <rect x="7" y="12" width="8" height="1" fill="#8C8273" />
      <rect x="7" y="14" width="10" height="1" fill="currentColor" />
      <rect x="7" y="16" width="7" height="1" fill="#8C8273" />
      <rect x="7" y="18" width="5" height="1" fill="#8C8273" />
    </svg>
  );
}

// 5. Gallery (Pixel Picture Frame with mountains and sun)
export function PixelGalleryIcon({ className = "", size = 28 }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {/* Outer wooden / metal frame */}
      <rect x="3" y="4" width="18" height="16" fill="currentColor" />
      <rect x="5" y="6" width="14" height="12" fill="var(--bg-canvas, #FAF7F2)" className="dark:fill-[#1A1814]" />
      
      {/* Sun / Moon */}
      <rect x="14" y="8" width="3" height="3" fill="#F59E0B" />
      
      {/* Far mountain */}
      <rect x="10" y="11" width="4" height="1" fill="#8C8273" opacity="0.6" />
      <rect x="9" y="12" width="6" height="2" fill="#8C8273" opacity="0.6" />
      
      {/* Near mountain / hills */}
      <rect x="6" y="13" width="2" height="1" fill="#10B981" />
      <rect x="5" y="14" width="5" height="1" fill="#10B981" />
      <rect x="5" y="15" width="8" height="2" fill="#10B981" />
      <rect x="13" y="14" width="4" height="3" fill="#059669" />
      
      {/* Foreground ground line */}
      <rect x="5" y="17" width="14" height="1" fill="currentColor" />
    </svg>
  );
}

// 6. Terminal (Pixel CRT monitor with prompt >_ )
export function PixelTerminalIcon({ className = "", size = 28 }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {/* Monitor bezel */}
      <rect x="3" y="4" width="18" height="13" fill="currentColor" />
      <rect x="5" y="6" width="14" height="9" fill="#0E1015" />
      
      {/* Stand */}
      <rect x="10" y="17" width="4" height="2" fill="currentColor" />
      <rect x="7" y="19" width="10" height="2" fill="currentColor" />
      
      {/* Prompt symbol ">" */}
      <rect x="7" y="8" width="1" height="1" fill="#10B981" />
      <rect x="8" y="9" width="1" height="1" fill="#10B981" />
      <rect x="7" y="10" width="1" height="1" fill="#10B981" />
      
      {/* Cursor "_" */}
      <rect x="10" y="10" width="2" height="1" fill="#10B981" />
    </svg>
  );
}

// 7. PixelStudio (Pixel Paint Palette & Brush)
export function PixelStudioIcon({ className = "", size = 28 }: PixelIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
    >
      {/* Palette board */}
      <rect x="5" y="5" width="12" height="2" fill="currentColor" />
      <rect x="4" y="7" width="15" height="2" fill="currentColor" />
      <rect x="3" y="9" width="17" height="6" fill="currentColor" />
      <rect x="4" y="15" width="15" height="2" fill="currentColor" />
      <rect x="6" y="17" width="10" height="2" fill="currentColor" />
      
      {/* Thumb hole */}
      <rect x="14" y="11" width="3" height="3" fill="var(--bg-canvas, #FAF7F2)" className="dark:fill-[#1A1814]" />
      
      {/* Color dabs */}
      <rect x="6" y="8" width="2" height="2" fill="#EF4444" />
      <rect x="10" y="7" width="2" height="2" fill="#3B82F6" />
      <rect x="6" y="12" width="2" height="2" fill="#10B981" />
      <rect x="9" y="14" width="2" height="2" fill="#F59E0B" />
      
      {/* Paintbrush tip sticking out top-right */}
      <rect x="17" y="2" width="3" height="3" fill="#D97706" />
      <rect x="19" y="4" width="2" height="3" fill="#8C8273" />
      <rect x="16" y="5" width="2" height="2" fill="#10B981" />
    </svg>
  );
}

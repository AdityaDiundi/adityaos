"use client";

import React, { useEffect, useState } from "react";

interface OdometerDigitProps {
  char: string;
  reducedMotion?: boolean;
  className?: string;
}

export function OdometerDigit({ char, reducedMotion = false, className = "" }: OdometerDigitProps) {
  const isDigit = /^\d$/.test(char);
  const num = isDigit ? parseInt(char, 10) : 0;
  const [prevChar, setPrevChar] = useState(char);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (char !== prevChar) {
      if (!reducedMotion && isDigit) {
        setIsRolling(true);
        const timer = setTimeout(() => {
          setIsRolling(false);
          setPrevChar(char);
        }, 140); // <= 150ms as required
        return () => clearTimeout(timer);
      } else {
        setPrevChar(char);
      }
    }
  }, [char, prevChar, isDigit, reducedMotion]);

  if (!isDigit || reducedMotion) {
    return <span className={`inline-block tabular-nums ${className}`}>{char}</span>;
  }

  // Odometer roll cylinder: 0 to 9 in a vertical column
  return (
    <span
      className={`inline-block relative overflow-hidden h-[1.15em] leading-[1.15em] tabular-nums align-baseline ${className}`}
      style={{ width: "0.62em" }}
      aria-hidden="true"
    >
      <span
        className="flex flex-col transition-transform duration-[140ms] ease-out will-change-transform"
        style={{
          transform: `translateY(-${num * 10}%)`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="h-[1.15em] leading-[1.15em] flex items-center justify-center">
            {n}
          </span>
        ))}
      </span>
    </span>
  );
}

export function OdometerText({
  text,
  reducedMotion = false,
  className = "",
}: {
  text: string;
  reducedMotion?: boolean;
  className?: string;
}) {
  return (
    <span className={`tabular-nums font-mono inline-flex items-baseline ${className}`}>
      {text.split("").map((c, i) => (
        <OdometerDigit key={i} char={c} reducedMotion={reducedMotion} />
      ))}
    </span>
  );
}

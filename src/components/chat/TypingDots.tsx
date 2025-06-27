import { useState, useEffect } from 'react';

const DOTS = ['.', '..', '...']; // 항상 최소 '.' 있음

export function TypingDots() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % DOTS.length);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-muted-foreground animate-pulse">
      {DOTS[index]}
    </span>
  );
}

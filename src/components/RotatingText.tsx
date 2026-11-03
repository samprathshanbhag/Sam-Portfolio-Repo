'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RotatingTextProps {
  words: string[];
  interval?: number;
}

export function RotatingText({ words, interval = 2800 }: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Expose control for deterministic verification and screenshots
    if (typeof window !== 'undefined') {
      (window as unknown as { __setRotatingIndex?: (i: number) => void }).__setRotatingIndex = (i: number) => {
        setIndex(((i % words.length) + words.length) % words.length);
      };
      (window as unknown as { __getRotatingWord?: () => string }).__getRotatingWord = () => words[index];
    }
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval, index]);

  return (
    <div className="relative min-h-[1.35em] leading-[1.3] w-full overflow-visible inline-flex items-center pb-[0.2em] -mb-[0.2em] select-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-medium text-accent underline decoration-accent/40 underline-offset-[6px] decoration-2 inline-block whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

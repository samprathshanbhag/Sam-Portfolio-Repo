'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { profile } from '@/data/profile';

export function StatsCounter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  return (
    <div
      ref={containerRef}
      className="w-full mt-16 pt-10 border-t border-surface-border/70 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8"
    >
      {profile.stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="flex flex-col space-y-1 group"
        >
          <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-content-primary group-hover:text-accent transition-colors flex items-baseline">
            <span>{stat.display}</span>
          </div>
          <span className="text-xs sm:text-sm text-content-secondary leading-snug">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}


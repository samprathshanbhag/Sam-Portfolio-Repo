'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export function LocalTimeWidget() {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in Asia/Kolkata (UTC+5:30)
      const formatted = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setTimeStr(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeStr) {
    return (
      <div className="flex items-center gap-2 text-xs font-mono text-content-muted">
        <span className="w-2 h-2 rounded-full bg-accent/60 animate-pulse" />
        <span>Bengaluru (UTC+5:30)</span>
      </div>
    );
  }

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-subtle/80 border border-surface-border text-xs font-mono text-content-secondary shadow-sm"
      title="Current local time in Bengaluru, India"
      aria-label={`Current local time in Bengaluru: ${timeStr}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-content-primary font-medium">{timeStr}</span>
      <span className="text-content-muted text-[10px] hidden sm:inline">· BLR (UTC+5:30)</span>
    </div>
  );
}


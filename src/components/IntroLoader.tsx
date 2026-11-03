'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { profile } from '@/data/profile';

export function IntroLoader() {
  const [hasVisited, setHasVisited] = useState<boolean>(true); // default true for SSR
  const [progress, setProgress] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // Check sessionStorage
    try {
      const visited = sessionStorage.getItem('samprath_portfolio_visited');
      if (visited === 'true') {
        setHasVisited(true);
        setIsVisible(false);
        return;
      }
    } catch (e) {
      // ignore
    }

    setHasVisited(false);
    setIsVisible(true);

    // Simulate loading percentage
    let current = 0;
    const interval = setInterval(() => {
      // Variable increment for authentic feel
      current += Math.floor(Math.random() * 8) + 4;
      if (current >= 100) {
        current = 100;
        setProgress(100);
        setIsReady(true);
        clearInterval(interval);
      } else {
        setProgress(current);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    try {
      sessionStorage.setItem('samprath_portfolio_visited', 'true');
    } catch (e) {
      // ignore
    }
    setIsVisible(false);
  };

  const handleSkip = () => {
    handleEnter();
  };

  if (hasVisited || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[100] flex flex-col justify-between p-6 sm:p-12 bg-[#141313] text-content-primary"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome screen"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-sm font-mono tracking-wider text-content-secondary uppercase">
                {profile.name}
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="text-xs font-mono tracking-widest uppercase text-content-muted hover:text-accent transition-colors px-3 py-1.5 rounded border border-surface-border hover:border-accent/40"
              aria-label="Skip introduction animation"
            >
              Skip Intro [ESC]
            </button>
          </div>

          {/* Center: Counter & Title */}
          <div className="max-w-xl mx-auto text-center w-full my-auto py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-surface-border text-xs font-mono text-accent mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Microsoft Fabric · Power BI · SQL · Python</span>
            </div>

            <div className="font-mono text-7xl sm:text-9xl font-light tracking-tighter text-content-primary mb-4 select-none">
              {progress}
              <span className="text-accent text-4xl sm:text-5xl ml-1 font-sans">%</span>
            </div>

            <p className="text-content-secondary text-sm sm:text-base font-mono mb-8 tracking-wide">
              {progress < 100 ? 'Loading the card & data models...' : 'Systems ready. Enter to explore.'}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-surface-subtle h-1 rounded-full overflow-hidden max-w-md mx-auto mb-10">
              <motion.div
                className="h-full bg-accent"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Enter Button */}
            {isReady && (
              <motion.button
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onClick={handleEnter}
                autoFocus
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent hover:bg-accent-hover text-[#141313] font-medium text-base tracking-wide transition-all shadow-[0_0_30px_rgba(232,176,74,0.3)] hover:shadow-[0_0_40px_rgba(232,176,74,0.5)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#141313]"
              >
                <span>Click to Enter</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-content-muted gap-2">
            <span>Bengaluru, India · DP-600 Certified</span>
            <span>Editorial Portfolio · 2026</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


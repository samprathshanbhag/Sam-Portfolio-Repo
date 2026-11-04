'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import {
  MessageSquare,
  ArrowDown,
  FileDown,
  MapPin,
} from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { profile } from '@/data/profile';
import { AbilityCard } from './AbilityCard';
import { RotatingText } from './RotatingText';
import { StatsCounter } from './StatsCounter';

export function Hero() {
  const { openContact } = useModal();
  const shouldReduceMotion = useReducedMotion();

  // Scroll tracking to fade out and nudge down indicator over first ~120px
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const indicatorY = useTransform(scrollY, [0, 120], [0, 16]);

  const scrollToNext = () => {
    const el = document.getElementById('stats') || document.getElementById('work');
    if (el) {
      const navOffset = 64;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) {
      const navOffset = 64;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <section
        id="home"
        className="relative min-h-[100svh] flex flex-col justify-between pt-16 sm:pt-20 lg:pt-20 pb-8 overflow-hidden"
      >
        {/* Background radial gradient accent */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
          {/* Main 2-column Grid: Copy on Left, Ability Card on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
            {/* Left Column: Chips, Headline, Short Intro, and Buttons */}
            <div className="lg:col-span-7 flex flex-col justify-start">
              {/* Status Chips Row */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5"
              >
                {profile.openToOpportunities && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Open to opportunities</span>
                  </div>
                )}

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-surface-border text-content-secondary text-xs font-mono">
                  <MapPin className="w-3 h-3 text-accent" />
                  <span>Based in Bengaluru, India</span>
                </div>
              </motion.div>

              {/* Headline with Rotating Words on their own line */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[28px] xs:text-3xl sm:text-4xl lg:text-[42px] xl:text-5xl font-normal tracking-tight text-content-primary leading-[1.26] mb-5"
              >
                <span>Hi, I&apos;m <span className="font-semibold">{profile.name.split(' ')[0]}</span>.</span>
                <br />
                <span className="inline-block pb-[0.08em]">I turn raw data into</span>
                <div className="relative min-h-[1.35em] leading-[1.3] mt-1 text-accent flex items-center overflow-visible pb-[0.2em] -mb-[0.2em]">
                  <RotatingText words={profile.taglines} />
                </div>
              </motion.h1>

              {/* Short Intro */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-content-secondary max-w-xl leading-relaxed mb-6"
              >
                Microsoft-certified (DP-600) Data Analyst building dashboards, data models and pipelines in Microsoft Fabric and Power BI.
              </motion.p>

              {/* Buttons Row */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3 sm:gap-3.5"
              >
                <button
                  onClick={openContact}
                  className="group inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-accent hover:bg-accent-hover text-[#141313] font-medium text-sm sm:text-base tracking-wide transition-all shadow-[0_0_20px_rgba(232,176,74,0.25)] hover:shadow-[0_0_30px_rgba(232,176,74,0.4)] focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Let&apos;s talk</span>
                </button>

                <button
                  onClick={scrollToWork}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-surface-subtle hover:bg-surface-elevated border border-surface-border text-content-primary font-medium text-sm sm:text-base transition-all group focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <span>See my work</span>
                  <ArrowDown className="w-4 h-4 text-accent transition-transform group-hover:translate-y-1" />
                </button>

                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-transparent hover:bg-surface-subtle border border-surface-border/60 hover:border-surface-border text-content-secondary hover:text-content-primary font-mono text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <FileDown className="w-4 h-4 text-accent" />
                  <span>Download resume</span>
                </a>
              </motion.div>
            </div>

            {/* Right Column: 3D Interactive Ability Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-start">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-full flex justify-center lg:justify-end"
              >
                <AbilityCard />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll to Explore Indicator: Anchored absolutely inside #home at full-width center, bottom: 28px */}
        <motion.div
          style={{ x: '-50%', opacity: indicatorOpacity, y: indicatorY }}
          onClick={scrollToNext}
          className="hero-scroll-indicator absolute bottom-7 left-1/2 z-20 hidden lg:flex flex-col items-center cursor-pointer select-none group focus:outline-none"
          role="button"
          tabIndex={0}
          aria-label="Scroll to explore work"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              scrollToNext();
            }
          }}
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1 text-content-muted group-hover:text-accent transition-colors">
            Scroll to explore
          </span>
          <ArrowDown
            className={`w-3.5 h-3.5 text-accent transition-transform group-hover:translate-y-0.5 ${
              shouldReduceMotion ? '' : 'animate-bounce'
            }`}
          />
          {/* Thin 1px vertical amber line (~28px tall) with looping downward beam */}
          <div className="relative w-[1px] h-7 bg-accent/20 overflow-hidden mx-auto mt-1.5 rounded-full">
            <motion.div
              className="w-full h-3 bg-accent rounded-full shadow-[0_0_8px_rgba(232,176,74,0.8)]"
              animate={
                shouldReduceMotion
                  ? { opacity: 0.6 }
                  : { y: [-12, 28] }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.2 }
                  : {
                      repeat: Infinity,
                      duration: 1.6,
                      ease: [0.4, 0, 0.6, 1],
                    }
              }
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Strip right below the hero fold */}
      <section id="stats" className="relative border-y border-surface-border/60 py-8 bg-[#141313]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <StatsCounter />
        </div>
      </section>
    </>
  );
}

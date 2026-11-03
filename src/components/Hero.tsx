'use client';

import { motion } from 'framer-motion';
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
    <section id="home" className="relative pt-24 lg:pt-[104px] pb-12 sm:pb-16 overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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

        {/* Scroll Indicator at bottom center of the hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={scrollToWork}
          className="hidden lg:flex flex-col items-center justify-center pt-8 pb-3 cursor-pointer text-content-muted hover:text-accent transition-colors select-none group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              scrollToWork();
            }
          }}
          aria-label="Scroll to explore work"
        >
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] mb-1.5 group-hover:text-accent transition-colors">
            Scroll to explore
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-accent animate-bounce" />
        </motion.div>

        {/* Stats Strip */}
        <div className="mt-4 pt-6 border-t border-surface-border/60">
          <StatsCounter />
        </div>
      </div>
    </section>
  );
}

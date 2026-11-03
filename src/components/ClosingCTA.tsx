'use client';

import { motion } from 'framer-motion';
import { MessageSquare, FileDown, Sparkles, ArrowRight } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { profile } from '@/data/profile';

export function ClosingCTA() {
  const { openContact } = useModal();

  return (
    <section className="py-24 sm:py-32 relative border-t border-surface-border/50 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Open to new opportunities</span>
        </div>

        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-content-primary mb-6 leading-tight">
          Have data that needs to <br />
          <span className="font-semibold italic text-accent">tell a story?</span> Let&apos;s talk.
        </h2>

        <p className="text-base sm:text-lg text-content-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          Whether you need an enterprise Microsoft Fabric lakehouse, high-impact executive Power BI dashboards, or a normalized star schema with SCD Type 2 tracking — I&apos;m ready to collaborate.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={openContact}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-accent hover:bg-accent-hover text-[#141313] font-medium text-base tracking-wide transition-all shadow-[0_0_25px_rgba(232,176,74,0.3)] hover:shadow-[0_0_35px_rgba(232,176,74,0.5)] focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Let&apos;s talk</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-surface-subtle hover:bg-surface-elevated border border-surface-border text-content-primary font-mono text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <FileDown className="w-4 h-4 text-accent" />
            <span>Download resume</span>
          </a>
        </div>
      </div>
    </section>
  );
}


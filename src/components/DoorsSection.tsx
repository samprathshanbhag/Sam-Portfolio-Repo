'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MoveHorizontal,
  KeyRound,
  X,
} from 'lucide-react';
import { skillDoors, SkillDoor } from '@/data/skills';

// --- INLINE SVG VISUALS IN AMBER/DARK PALETTE ---

function BarChartVisual() {
  return (
    <div className="h-[68px] sm:h-[72px] w-full rounded-xl bg-[#0C0B0B] border border-surface-border/80 px-2.5 py-1.5 mb-3 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 220 54" className="w-full h-full text-accent" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Dashboards bar chart visual">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5C163" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E8B04A" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E8B04A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F5C163" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Subtle horizontal grid lines */}
        <line x1="12" y1="14" x2="208" y2="14" stroke="#262423" strokeDasharray="3 3" strokeWidth="1.2" />
        <line x1="12" y1="30" x2="208" y2="30" stroke="#262423" strokeDasharray="3 3" strokeWidth="1.2" />
        <line x1="12" y1="48" x2="208" y2="48" stroke="#383431" strokeWidth="1.5" />

        {/* Scaled Crisp Bars */}
        <rect x="22" y="26" width="18" height="22" rx="3" fill="url(#barGrad)" opacity="0.75" />
        <rect x="60" y="16" width="18" height="32" rx="3" fill="url(#barGrad)" opacity="0.85" />
        <rect x="98" y="32" width="18" height="16" rx="3" fill="url(#barGrad)" opacity="0.65" />
        <rect x="136" y="10" width="18" height="38" rx="3" fill="url(#barGrad)" opacity="0.92" />
        <rect x="174" y="4" width="18" height="44" rx="3" fill="url(#barGrad)" opacity="1" />

        {/* Upward Line Trend with glowing endpoint */}
        <path d="M 31 24 L 69 14 L 107 30 L 145 8 L 183 3" stroke="url(#lineGrad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="183" cy="3" r="3.5" fill="#F5C163" />
        <circle cx="183" cy="3" r="7" stroke="#F5C163" strokeWidth="1.2" opacity="0.6" />
      </svg>
    </div>
  );
}

function MedallionPipelineVisual() {
  return (
    <div className="h-[68px] sm:h-[72px] w-full rounded-xl bg-[#0C0B0B] border border-surface-border/80 px-2 py-1.5 mb-3 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 220 54" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Bronze Silver Gold pipeline visual">
        <defs>
          <linearGradient id="bronzeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D48D55" />
            <stop offset="100%" stopColor="#8A4C22" />
          </linearGradient>
          <linearGradient id="silverGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5C163" />
            <stop offset="100%" stopColor="#B47B16" />
          </linearGradient>
        </defs>

        {/* Central Pipeline Track */}
        <line x1="32" y1="27" x2="188" y2="27" stroke="#2B2826" strokeWidth="3.5" strokeDasharray="5 3" />
        <line x1="32" y1="27" x2="188" y2="27" stroke="#E8B04A" strokeWidth="1.8" strokeOpacity="0.8" />

        {/* Bronze Stage */}
        <g transform="translate(10, 8)">
          <rect x="0" y="0" width="48" height="38" rx="7" fill="#1C1816" stroke="#D48D55" strokeWidth="1.6" />
          <circle cx="11" cy="19" r="5" fill="url(#bronzeGrad)" />
          <text x="21" y="22" fill="#E5A06D" fontSize="9" fontFamily="monospace" fontWeight="bold">BRZ</text>
        </g>

        {/* Chevron Flow 1 */}
        <path d="M 68 23 L 74 27 L 68 31" stroke="#E8B04A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85" />

        {/* Silver Stage */}
        <g transform="translate(83, 8)">
          <rect x="0" y="0" width="48" height="38" rx="7" fill="#16181B" stroke="#94A3B8" strokeWidth="1.6" />
          <circle cx="11" cy="19" r="5" fill="url(#silverGrad)" />
          <text x="21" y="22" fill="#E2E8F0" fontSize="9" fontFamily="monospace" fontWeight="bold">SLV</text>
        </g>

        {/* Chevron Flow 2 */}
        <path d="M 141 23 L 147 27 L 141 31" stroke="#E8B04A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85" />

        {/* Gold Stage */}
        <g transform="translate(156, 7)">
          <rect x="0" y="0" width="54" height="40" rx="7" fill="#221C14" stroke="#F5C163" strokeWidth="2" />
          <circle cx="12" cy="20" r="5.5" fill="url(#goldGrad)" />
          <text x="23" y="23" fill="#F5C163" fontSize="9.5" fontFamily="monospace" fontWeight="bold">GOLD</text>
        </g>
      </svg>
    </div>
  );
}

function StarSchemaVisual() {
  return (
    <div className="h-[68px] sm:h-[72px] w-full rounded-xl bg-[#0C0B0B] border border-surface-border/80 px-2 py-1.5 mb-3 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 220 54" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Star schema data modeling visual">
        {/* Connecting Relationship Lines */}
        <line x1="48" y1="14" x2="84" y2="27" stroke="#E8B04A" strokeWidth="1.8" strokeOpacity="0.8" strokeDasharray="3 2" />
        <line x1="48" y1="40" x2="84" y2="27" stroke="#E8B04A" strokeWidth="1.8" strokeOpacity="0.8" strokeDasharray="3 2" />
        <line x1="172" y1="14" x2="136" y2="27" stroke="#E8B04A" strokeWidth="1.8" strokeOpacity="0.8" strokeDasharray="3 2" />
        <line x1="172" y1="40" x2="136" y2="27" stroke="#E8B04A" strokeWidth="1.8" strokeOpacity="0.8" strokeDasharray="3 2" />

        {/* Dimension 1 (Top Left) */}
        <rect x="6" y="5" width="42" height="19" rx="4" fill="#191817" stroke="#4A4541" strokeWidth="1.4" />
        <rect x="6" y="5" width="42" height="6" rx="4" fill="#332E2A" />
        <text x="13" y="19" fill="#D1CCC5" fontSize="8.5" fontFamily="monospace" fontWeight="bold">DIM 1</text>

        {/* Dimension 2 (Bottom Left) */}
        <rect x="6" y="30" width="42" height="19" rx="4" fill="#191817" stroke="#4A4541" strokeWidth="1.4" />
        <rect x="6" y="30" width="42" height="6" rx="4" fill="#332E2A" />
        <text x="13" y="44" fill="#D1CCC5" fontSize="8.5" fontFamily="monospace" fontWeight="bold">DIM 2</text>

        {/* Center Fact Table */}
        <rect x="84" y="6" width="52" height="42" rx="5" fill="#211C14" stroke="#E8B04A" strokeWidth="2" />
        <rect x="84" y="6" width="52" height="12" rx="5" fill="#E8B04A" fillOpacity="0.85" />
        <text x="96" y="15" fill="#141313" fontSize="9" fontFamily="monospace" fontWeight="bold">FACT</text>
        <line x1="90" y1="24" x2="130" y2="24" stroke="#E8B04A" strokeWidth="1.4" strokeOpacity="0.6" />
        <line x1="90" y1="31" x2="124" y2="31" stroke="#E8B04A" strokeWidth="1.4" strokeOpacity="0.6" />
        <line x1="90" y1="38" x2="116" y2="38" stroke="#E8B04A" strokeWidth="1.4" strokeOpacity="0.4" />

        {/* Dimension 3 (Top Right) */}
        <rect x="172" y="5" width="42" height="19" rx="4" fill="#191817" stroke="#4A4541" strokeWidth="1.4" />
        <rect x="172" y="5" width="42" height="6" rx="4" fill="#332E2A" />
        <text x="179" y="19" fill="#D1CCC5" fontSize="8.5" fontFamily="monospace" fontWeight="bold">DIM 3</text>

        {/* Dimension 4 (Bottom Right) */}
        <rect x="172" y="30" width="42" height="19" rx="4" fill="#191817" stroke="#4A4541" strokeWidth="1.4" />
        <rect x="172" y="30" width="42" height="6" rx="4" fill="#332E2A" />
        <text x="179" y="44" fill="#D1CCC5" fontSize="8.5" fontFamily="monospace" fontWeight="bold">DIM 4</text>
      </svg>
    </div>
  );
}

function StepMarkersVisual() {
  return (
    <div className="h-[68px] sm:h-[72px] w-full rounded-xl bg-[#0C0B0B] border border-surface-border/80 px-2 py-1.5 mb-3 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 220 54" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Step markers curriculum visual">
        {/* Curved Progress Path */}
        <path d="M 22 42 Q 65 35 110 24 T 195 12" stroke="#2B2826" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 22 42 Q 65 35 110 24 T 195 12" stroke="#E8B04A" strokeWidth="2" strokeOpacity="0.8" strokeDasharray="5 3" />

        {/* Step 01 */}
        <circle cx="22" cy="42" r="9" fill="#1A1817" stroke="#786B5A" strokeWidth="1.6" />
        <text x="18" y="45" fill="#B8B3AA" fontSize="8.5" fontFamily="monospace" fontWeight="bold">01</text>

        {/* Step 02 */}
        <circle cx="72" cy="33" r="9" fill="#1E1A16" stroke="#B88A3B" strokeWidth="1.6" />
        <text x="68" y="36" fill="#E8B04A" fontSize="8.5" fontFamily="monospace" fontWeight="bold">02</text>

        {/* Step 03 */}
        <circle cx="128" cy="22" r="10" fill="#241E16" stroke="#E8B04A" strokeWidth="1.8" />
        <text x="124" y="25" fill="#F5C163" fontSize="9" fontFamily="monospace" fontWeight="bold">03</text>

        {/* Step 04 (Achievement/Mastery) */}
        <circle cx="188" cy="12" r="12" fill="#2E2416" stroke="#F5C163" strokeWidth="2.2" />
        <circle cx="188" cy="12" r="16" stroke="#F5C163" strokeWidth="1.2" strokeOpacity="0.5" strokeDasharray="3 2" />
        <path d="M 183 12 L 187 16 L 194 9" stroke="#F5C163" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function getDoorVisual(id: string) {
  switch (id) {
    case 'dashboards-bi':
      return <BarChartVisual />;
    case 'data-engineering':
      return <MedallionPipelineVisual />;
    case 'data-modeling':
      return <StarSchemaVisual />;
    case 'training':
      return <StepMarkersVisual />;
    default:
      return <BarChartVisual />;
  }
}

// --- MAIN DOORS SECTION ---

export function DoorsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeDoor, setActiveDoor] = useState<string | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleToggleDoor = (id: string) => {
    setActiveDoor((prev) => (prev === id ? null : id));
  };

  return (
    <section id="work" className="pt-10 pb-12 sm:pb-16 relative overflow-hidden scroll-mt-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 sm:mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-surface-border text-xs font-mono text-accent mb-2 sm:mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skill Portfolios · The Four Doors</span>
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-[40px] font-light tracking-tight text-content-primary">
              Magic happens <span className="font-semibold italic">behind the doors.</span>
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm font-mono text-content-secondary">
              <MoveHorizontal className="w-4 h-4 text-accent animate-pulse" />
              <span className="hidden [@media(hover:none)]:inline">
                Swipe along the wall or tap a door to step inside
              </span>
              <span className="inline [@media(hover:none)]:hidden">
                Swipe along the wall or hover over a door to step inside
              </span>
            </div>
          </div>

          {/* Desktop Left/Right Controls */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-full bg-surface-subtle border border-surface-border text-content-secondary hover:text-content-primary hover:border-accent transition-colors"
              aria-label="Scroll doors left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-full bg-surface-subtle border border-surface-border text-content-secondary hover:text-content-primary hover:border-accent transition-colors"
              aria-label="Scroll doors right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Wall */}
      <div
        ref={scrollContainerRef}
        className="doors-scroll-track w-full overflow-x-auto no-scrollbar scroll-smooth pb-6 flex gap-5 sm:gap-6 cursor-grab active:cursor-grabbing snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {skillDoors.map((door) => (
          <DoorCard
            key={door.id}
            door={door}
            isOpen={activeDoor === door.id}
            onOpen={() => setActiveDoor(door.id)}
            onClose={() => setActiveDoor(null)}
            onToggle={() => handleToggleDoor(door.id)}
          />
        ))}
      </div>
    </section>
  );
}

function DoorCard({
  door,
  isOpen,
  onOpen,
  onClose,
  onToggle,
}: {
  door: SkillDoor;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Check if touch device without hover capability
    const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
    if (isTouchDevice) {
      if (!isOpen) {
        e.preventDefault();
        onOpen();
        return;
      }
    }
  };

  return (
    <div
      id={`door-${door.id}`}
      onMouseEnter={() => {
        if (typeof window !== 'undefined' && !window.matchMedia('(hover: none)').matches) {
          onOpen();
        }
      }}
      onMouseLeave={() => {
        if (typeof window !== 'undefined' && !window.matchMedia('(hover: none)').matches) {
          onClose();
        }
      }}
      onClick={handleCardClick}
      className="flex-shrink-0 w-[285px] sm:w-[335px] snap-start select-none"
    >
      <div className="relative rounded-2xl p-1.5 sm:p-2 bg-[#121111] border-2 border-surface-border/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-accent/80 hover:shadow-[0_20px_50px_rgba(232,176,74,0.15)] overflow-hidden">
        {/* Top Arch Label */}
        <div className="flex items-center justify-between px-3 py-1.5 sm:py-2 text-[10px] font-mono text-content-muted border-b border-surface-border/50">
          <span className="flex items-center gap-1.5 text-accent font-semibold">
            <KeyRound className="w-3 h-3" />
            DOOR {door.number}
          </span>
          <span className="tracking-widest uppercase">PORTFOLIO</span>
        </div>

        {/* Door Frame & Canvas with 3D Perspective */}
        <div className="relative h-[385px] sm:h-[395px] rounded-xl overflow-hidden bg-[#0A0A0A] door-container">
          {/* ========================================================= */}
          {/* INTERIOR ROOM: Fully revealed and unblocked when door swings open */}
          {/* ========================================================= */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1C1B1A] via-[#151414] to-[#0E0D0D] p-5 sm:p-6 flex flex-col justify-between z-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] font-mono text-accent uppercase tracking-wider font-semibold">
                  ROOM {door.number} · SPEC
                </span>
                {/* Touch toggle close button (for touch screens) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="hidden [@media(hover:none)]:flex p-1.5 rounded-full bg-surface-subtle text-content-muted hover:text-content-primary"
                  aria-label="Close door"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-lg sm:text-xl font-semibold text-content-primary leading-snug">
                {door.title}
              </h4>

              <p className="text-xs text-content-secondary line-clamp-2 sm:line-clamp-3 leading-relaxed">
                {door.description}
              </p>

              {/* Metrics with glowing badges */}
              <div className="space-y-1.5 pt-2 border-t border-surface-border/60">
                {door.metrics.map((m) => (
                  <div key={m} className="text-xs font-mono text-content-muted flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span className="text-content-secondary">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Link to Room Spec Page */}
            <div className="pt-3 border-t border-surface-border/60">
              <Link
                href={door.slug}
                className="group w-full py-2 px-3.5 rounded-xl bg-accent/15 hover:bg-accent border border-accent/40 hover:border-accent text-accent hover:text-[#141313] flex items-center justify-between text-xs font-mono font-medium transition-all shadow-sm"
              >
                <span>Explore Works & Specs</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* ========================================================= */}
          {/* PHYSICAL DOOR LEAF: Swings past 90deg behind card & fades out */}
          {/* ========================================================= */}
          <div
            className={`door-leaf absolute inset-0 z-10 bg-gradient-to-b from-[#1E1D1D] via-[#171616] to-[#111010] border border-surface-border/80 p-5 sm:p-5.5 flex flex-col justify-between shadow-2xl ${
              isOpen ? 'door-open' : 'door-closed'
            }`}
          >
            {/* Top Area: Number & Handle */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-2xl sm:text-3xl font-light text-accent">
                  {door.number}
                </span>
                {/* Brass Handle with realistic lighting */}
                <div className="w-3 h-10 rounded-full bg-gradient-to-b from-amber-300 via-amber-600 to-amber-800 shadow-[0_2px_8px_rgba(0,0,0,0.6)] border border-amber-200/50" />
              </div>

              {/* High-quality Inline SVG Visual in Amber/Dark Palette */}
              {getDoorVisual(door.id)}

              <h3 className="text-lg sm:text-xl font-semibold text-content-primary mb-1">
                {door.title}
              </h3>
              <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                {door.subtitle}
              </p>
            </div>

            {/* Bottom Area: Tool Badges & Responsive Touch/Hover Label */}
            <div className="pt-2.5 border-t border-surface-border/60">
              <div className="flex flex-wrap gap-1 mb-2.5">
                {door.tools.slice(0, 3).map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-[10px] font-mono text-content-secondary"
                  >
                    {tool}
                  </span>
                ))}
                {door.tools.length > 3 && (
                  <span className="px-1.5 py-0.5 rounded bg-surface-subtle text-[10px] font-mono text-content-muted">
                    +{door.tools.length - 3}
                  </span>
                )}
              </div>

              {/* Touch vs Hover text */}
              <div className="flex items-center justify-between text-xs font-mono text-content-muted group-hover:text-accent transition-colors">
                <span className="hidden [@media(hover:none)]:inline">Tap to open</span>
                <span className="inline [@media(hover:none)]:hidden">Hover to unlock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

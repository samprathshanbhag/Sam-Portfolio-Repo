'use client';

import React, { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Cpu, Database, Sparkles } from 'lucide-react';
import { profile } from '@/data/profile';

export function AbilityCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const shouldReduceMotion = useReducedMotion();

  // Mouse tilt values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs
  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-12deg', '12deg']);

  // Parallax layers: glow and glyphs move slightly more than photo for 3D depth
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], [-16, 16]);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], [-16, 16]);

  const glyphX = useTransform(mouseXSpring, [-0.5, 0.5], [-22, 22]);
  const glyphY = useTransform(mouseYSpring, [-0.5, 0.5], [-22, 22]);

  const photoX = useTransform(mouseXSpring, [-0.5, 0.5], [-5, 5]);
  const photoY = useTransform(mouseYSpring, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const xPct = mouseX / rect.width - 0.5;
      const yPct = mouseY / rect.height - 0.5;

      x.set(xPct);
      y.set(yPct);

      setGlarePosition({
        x: (mouseX / rect.width) * 100,
        y: (mouseY / rect.height) * 100,
      });
    },
    [x, y]
  );

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!cardRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = cardRef.current.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      const xPct = touchX / rect.width - 0.5;
      const yPct = touchY / rect.height - 0.5;

      x.set(xPct);
      y.set(yPct);

      setGlarePosition({
        x: (touchX / rect.width) * 100,
        y: (touchY / rect.height) * 100,
      });
    },
    [x, y]
  );

  return (
    <div className="relative w-full max-w-[305px] sm:max-w-[315px] lg:max-w-[325px] perspective-card ml-auto">
      {/* Ambient glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-accent/20 via-amber-600/10 to-accent/20 rounded-2xl blur-xl opacity-40 group-hover:opacity-75 transition-opacity" />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full rounded-2xl bg-gradient-to-b from-[#1C1B1A] via-[#161515] to-[#121111] border border-surface-border p-4 sm:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] select-none transition-shadow duration-300 hover:shadow-[0_25px_60px_rgba(232,176,74,0.15)] overflow-hidden"
      >
        {/* Dynamic Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0.08,
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.22) 0%, rgba(232, 176, 74, 0.08) 40%, transparent 70%)`,
          }}
        />

        {/* Card Header: Chip & Classification */}
        <div className="flex items-center justify-between border-b border-surface-border/70 pb-2.5 mb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4.5 rounded bg-gradient-to-tr from-amber-600 to-amber-300 p-[1px] shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-[#1A1817] rounded-[2px] flex items-center justify-center">
                <Cpu className="w-3 h-3 text-accent" />
              </div>
            </div>
            <span className="text-[10px] tracking-widest text-content-secondary uppercase font-semibold">
              ID // DP-600 SPEC
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ACTIVE</span>
          </div>
        </div>

        {/* Card Photo Area: 4:5 Portrait Ratio spanning FULL INNER WIDTH, Moody Low-Key B&W with Halo Backlight Glow */}
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#0F0E0E] mb-2.5 sm:mb-3 border border-accent/25 shadow-[0_6px_22px_rgba(0,0,0,0.7)]">
          {/* Layer 1: Warm amber radial glow centered behind head and slightly above it (halo/backlight raised to ~30% opacity) */}
          <motion.div
            style={{ x: glowX, y: glowY }}
            className="pointer-events-none absolute -top-10 left-[54%] -translate-x-1/2 w-72 h-72 sm:w-80 sm:h-80 rounded-full"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(232, 176, 74, 0.60) 0%, rgba(232, 176, 74, 0.35) 38%, rgba(232, 176, 74, 0.15) 60%, transparent 75%)',
                filter: 'blur(26px)',
              }}
            />
          </motion.div>

          {/* Layer 2: Faint dot-grid pattern at 6-8% opacity */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(rgba(232, 176, 74, 0.6) 1px, transparent 1px)',
              backgroundSize: '10px 10px',
            }}
          />

          {/* Layer 3: Tightly Cropped 4:5 B&W Low-key Photo with mix-blend-mode: screen */}
          <motion.div
            style={{ x: photoX, y: photoY }}
            className="absolute inset-0 z-10 pointer-events-none"
          >
            <Image
              src="/portrait-bw.jpg"
              alt="Portrait of Samprath Shanbhag"
              fill
              priority
              sizes="(max-width: 640px) 290px, 320px"
              style={{
                objectFit: 'cover',
                objectPosition: 'center center',
                mixBlendMode: 'screen',
              }}
              className="transition-transform duration-700 hover:scale-105"
            />
          </motion.div>

          {/* Layer 4: Fine film grain overlay at ~8% opacity */}
          <div
            className="pointer-events-none absolute inset-0 z-20 opacity-[0.08]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Layer 5: Soft vignette */}
          <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_18px_rgba(15,14,14,0.7)]" />

          {/* Overlays: Restyled BLR · INDIA tag in BOTTOM-LEFT (safely clear of neck and face) */}
          <div className="absolute bottom-2.5 left-2.5 z-30 px-2.5 py-0.5 rounded-full bg-[#141313]/90 backdrop-blur-md border border-white/10 text-[9px] font-mono text-[#D4CFC6] tracking-wider shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            BLR · INDIA
          </div>
        </div>

        {/* Name and Designation */}
        <div className="mb-2.5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-content-primary">
              {profile.name}
            </h3>
            <span className="text-xs font-mono text-accent font-semibold">DP-600</span>
          </div>
          <p className="text-xs font-mono text-accent tracking-wide mt-0.5">
            {profile.role} · Microsoft Fabric Specialist
          </p>
          <p className="text-[11px] text-content-secondary mt-0.5 line-clamp-1 leading-snug">
            Dimensional warehouses (9D/10F) & Medallion platforms.
          </p>
        </div>

        {/* Card Ability Meters / Badges */}
        <div className="space-y-1 pt-2 border-t border-surface-border/60 text-[11px] font-mono">
          <div className="flex items-center justify-between text-content-secondary">
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-accent" />
              <span>Data Modeling</span>
            </span>
            <span className="text-accent font-semibold">9 Dims · 10 Facts</span>
          </div>

          <div className="flex items-center justify-between text-content-secondary">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span>Volume Analyzed</span>
            </span>
            <span className="text-content-primary font-semibold">1.5M+ Rows</span>
          </div>

          <div className="flex items-center justify-between text-content-secondary">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>Fabric & Power BI</span>
            </span>
            <span className="text-accent font-semibold">Associate Level</span>
          </div>
        </div>

        {/* Bottom Barcode / Serial */}
        <div className="mt-2.5 pt-2 border-t border-surface-border/40 flex items-center justify-between text-[8px] font-mono text-content-muted">
          <span>SERIAL: FAB-DP600-2026-BLR</span>
          <span className="tracking-widest">||||| | |||| || |||</span>
        </div>
      </motion.div>
    </div>
  );
}

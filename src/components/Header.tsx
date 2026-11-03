'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { profile } from '@/data/profile';
import { LocalTimeWidget } from './LocalTimeWidget';

export function Header() {
  const { toggleMenu, openContact } = useModal();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#141313]/85 backdrop-blur-md border-b border-surface-border/60 py-3 shadow-lg shadow-black/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Name */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-content-primary hover:text-accent transition-colors"
          aria-label="Samprath Shanbhag Home"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-accent group-hover:scale-125 transition-transform" />
          <span className="font-mono text-sm sm:text-base font-semibold tracking-tight">
            {profile.name}
          </span>
        </Link>

        {/* Live Local Time Widget */}
        <div className="hidden md:flex items-center">
          <LocalTimeWidget />
        </div>

        {/* Action Buttons: Menu & Let's talk */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-subtle/80 hover:bg-surface-elevated border border-surface-border text-content-primary text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Open navigation menu"
          >
            <Menu className="w-4 h-4 text-accent" />
            <span className="tracking-wide">Menu</span>
          </button>

          <button
            onClick={openContact}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent hover:bg-accent-hover text-[#141313] text-xs sm:text-sm font-medium transition-all shadow-[0_0_15px_rgba(232,176,74,0.25)] hover:shadow-[0_0_20px_rgba(232,176,74,0.4)] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-[#141313]"
            aria-label="Open contact form"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Let&apos;s talk</span>
          </button>
        </div>
      </div>
    </header>
  );
}


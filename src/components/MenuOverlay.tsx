'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight, Mail, Linkedin, Github } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { profile } from '@/data/profile';
import { skillDoors } from '@/data/skills';

export function MenuOverlay() {
  const { isMenuOpen, closeMenu, openContact } = useModal();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    if (isMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen, closeMenu]);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-[#141313]/95 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-12 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-surface-border/60 pb-6">
            <Link
              href="/"
              onClick={closeMenu}
              className="text-lg font-mono font-medium tracking-tight text-content-primary hover:text-accent transition-colors"
            >
              {profile.name}
            </Link>
            <button
              onClick={closeMenu}
              className="p-2.5 rounded-full bg-surface-subtle border border-surface-border text-content-secondary hover:text-content-primary hover:border-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation Links */}
          <div className="my-auto py-10 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Primary Pages */}
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-accent mb-6">
                Navigation
              </p>
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="group flex items-center justify-between text-2xl sm:text-3xl font-light text-content-primary hover:text-accent transition-colors py-1"
                >
                  <span>Home</span>
                  <ArrowUpRight className="w-5 h-5 text-content-muted group-hover:text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>

                <a
                  href="#story"
                  onClick={closeMenu}
                  className="group flex items-center justify-between text-2xl sm:text-3xl font-light text-content-primary hover:text-accent transition-colors py-1"
                >
                  <span>My Story (Timeline)</span>
                  <ArrowUpRight className="w-5 h-5 text-content-muted group-hover:text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>

                <a
                  href="#certifications"
                  onClick={closeMenu}
                  className="group flex items-center justify-between text-2xl sm:text-3xl font-light text-content-primary hover:text-accent transition-colors py-1"
                >
                  <span>Certifications (DP-600)</span>
                  <ArrowUpRight className="w-5 h-5 text-content-muted group-hover:text-accent transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>

                <button
                  onClick={() => {
                    closeMenu();
                    openContact();
                  }}
                  className="group flex items-center justify-between text-2xl sm:text-3xl font-light text-accent text-left hover:text-accent-hover transition-colors py-1"
                >
                  <span>Let&apos;s Talk</span>
                  <ArrowUpRight className="w-5 h-5 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </nav>
            </div>

            {/* The 4 Skill Doors */}
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-accent mb-6">
                The Four Doors (Skill Portfolios)
              </p>
              <div className="flex flex-col space-y-3">
                {skillDoors.map((door) => (
                  <Link
                    key={door.id}
                    href={door.slug}
                    onClick={closeMenu}
                    className="p-3.5 rounded-lg bg-surface-subtle/40 border border-surface-border/60 hover:border-accent/60 hover:bg-surface-subtle transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-accent">{door.number}</span>
                        <span className="font-medium text-content-primary group-hover:text-accent transition-colors">
                          {door.title}
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-content-muted group-hover:text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                    <p className="text-xs text-content-muted line-clamp-1">{door.subtitle}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer of menu */}
          <div className="border-t border-surface-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-content-muted">
            <div className="flex items-center gap-6">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 hover:text-accent transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </a>
            </div>
            <span>Bengaluru, India · Asia/Kolkata</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


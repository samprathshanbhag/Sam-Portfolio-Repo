'use client';

import Link from 'next/link';
import { ArrowUp, Github, Linkedin, Mail, ExternalLink, MapPin } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { profile } from '@/data/profile';
import { skillDoors } from '@/data/skills';
import { LocalTimeWidget } from './LocalTimeWidget';

export function Footer() {
  const { openContact } = useModal();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F0E0E] border-t border-surface-border text-content-secondary pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-16 border-b border-surface-border/60">
          {/* Identity & Bio (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-content-primary font-mono text-lg font-bold tracking-tight hover:text-accent transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span>{profile.name}</span>
            </Link>
            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-sm">
              Microsoft-certified Data Analyst (DP-600) specializing in Microsoft Fabric, scalable dimensional models, and high-clarity business intelligence.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-surface-subtle border border-surface-border hover:border-accent text-content-secondary hover:text-accent transition-colors"
                aria-label="Samprath's LinkedIn profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-surface-subtle border border-surface-border hover:border-accent text-content-secondary hover:text-accent transition-colors"
                aria-label="Samprath's GitHub profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="p-2.5 rounded-full bg-surface-subtle border border-surface-border hover:border-accent text-content-secondary hover:text-accent transition-colors"
                aria-label="Email Samprath"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Work: The 4 Doors */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
              Work & Doors
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {skillDoors.map((door) => (
                <li key={door.id}>
                  <Link
                    href={door.slug}
                    className="hover:text-content-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    <span className="text-content-muted font-mono text-xs">{door.number}</span>
                    <span>{door.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigate Column */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
              Navigate
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-content-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a href="#story" className="hover:text-content-primary transition-colors">
                  My Story (Timeline)
                </a>
              </li>
              <li>
                <a href="#certifications" className="hover:text-content-primary transition-colors">
                  Certifications (DP-600)
                </a>
              </li>
              <li>
                <button
                  onClick={openContact}
                  className="hover:text-accent transition-colors text-left"
                >
                  Let&apos;s talk
                </button>
              </li>
              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-content-primary transition-colors inline-flex items-center gap-1"
                >
                  <span>Resume PDF</span>
                  <ExternalLink className="w-3 h-3 text-content-muted" />
                </a>
              </li>
            </ul>
          </div>

          {/* Status Column */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-4">
              Status & Time
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Available for roles</span>
              </div>
              <div className="flex items-center gap-2 text-content-secondary">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>Bengaluru, India</span>
              </div>
              <div className="pt-1">
                <LocalTimeWidget />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-content-muted">
          <div>
            <span>© 2026 {profile.name}. Designed and built by me.</span>
            <span className="mx-2">·</span>
            <Link href="/legal" className="hover:text-accent underline underline-offset-2">
              Privacy & credits
            </Link>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 hover:text-content-primary transition-colors group"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
}


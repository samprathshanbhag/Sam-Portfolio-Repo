import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Heart, Code2 } from 'lucide-react';
import { profile } from '@/data/profile';

export const metadata: Metadata = {
  title: 'Privacy & Credits | Samprath Shanbhag',
  description: 'Legal notices, privacy standards, design credits, and open-source attributions.',
};

export default function LegalPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-content-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-content-primary mb-4">
          Privacy & Credits
        </h1>
        <p className="text-sm font-mono text-accent mb-12">
          Last revised: 2026 · Bengaluru, India
        </p>

        <div className="space-y-12 text-content-secondary leading-relaxed text-sm sm:text-base">
          {/* Privacy section */}
          <section className="p-6 sm:p-8 rounded-3xl bg-surface-subtle/50 border border-surface-border space-y-4">
            <div className="flex items-center gap-2 text-content-primary font-semibold text-lg">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h2>Privacy & Data Integrity</h2>
            </div>
            <p>
              This website is a personal professional portfolio built with user privacy as a first-class consideration:
            </p>
            <ul className="list-disc list-inside space-y-2 text-content-secondary text-xs sm:text-sm pl-2">
              <li>
                <strong className="text-content-primary">No invasive tracking:</strong> No advertising trackers, third-party behavioral beacons, or cross-site tracking scripts are utilized on this domain.
              </li>
              <li>
                <strong className="text-content-primary">Session storage:</strong> A single standard browser flag (<code className="text-accent font-mono text-xs">samprath_portfolio_visited</code>) is maintained in your browser&apos;s sessionStorage solely to ensure the welcome intro card loads once per active session.
              </li>
              <li>
                <strong className="text-content-primary">Client & Employer Confidentiality:</strong> Work conducted for SustuneTech (such as the SITLBI Sales Analytics Data Warehouse) is documented solely in high-level architectural terms (star schema, SCD Type 2 mechanics, table cardinality). Zero proprietary data, customer records, financial figures, or confidential schema extracts are hosted or disclosed.
              </li>
              <li>
                <strong className="text-content-primary">Direct Communication:</strong> The contact form triggers your native mail application via an encrypted client-side mailto protocol. No contact messages or email details are retained in a central third-party database.
              </li>
            </ul>
          </section>

          {/* Credits & Open Source */}
          <section className="p-6 sm:p-8 rounded-3xl bg-surface-subtle/50 border border-surface-border space-y-4">
            <div className="flex items-center gap-2 text-content-primary font-semibold text-lg">
              <Code2 className="w-5 h-5 text-accent" />
              <h2>Open Source & Technical Credits</h2>
            </div>
            <p>
              This portfolio is engineered using leading modern web foundations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-surface-elevated/60 border border-surface-border">
                <div className="text-content-primary font-semibold">Next.js 14 App Router</div>
                <div className="text-content-muted mt-0.5">Vercel React Framework</div>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated/60 border border-surface-border">
                <div className="text-content-primary font-semibold">Tailwind CSS</div>
                <div className="text-content-muted mt-0.5">Utility-first styling system</div>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated/60 border border-surface-border">
                <div className="text-content-primary font-semibold">Framer Motion</div>
                <div className="text-content-muted mt-0.5">Motion & interactive gestures</div>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated/60 border border-surface-border">
                <div className="text-content-primary font-semibold">Lucide Icons</div>
                <div className="text-content-muted mt-0.5">Clean, accessible SVG iconography</div>
              </div>
            </div>
          </section>

          {/* Design Attribution */}
          <section className="p-6 sm:p-8 rounded-3xl bg-surface-subtle/50 border border-surface-border space-y-4">
            <div className="flex items-center gap-2 text-content-primary font-semibold text-lg">
              <Heart className="w-5 h-5 text-accent" />
              <h2>Design & Concept Attribution</h2>
            </div>
            <p>
              The horizontal one-door-per-skill interactive mechanism and ability-card visual aesthetics are conceptually inspired by the editorial design language of Rishi Thakor, reimagined and coded independently from the ground up for Samprath Shanbhag with original copy, branding, data models, and color palettes.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}


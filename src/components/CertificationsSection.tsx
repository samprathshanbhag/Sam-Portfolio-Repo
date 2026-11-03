'use client';

import { motion } from 'framer-motion';
import { Award, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { certifications } from '@/data/certifications';

export function CertificationsSection() {
  const featured = certifications.find((c) => c.featured);
  const others = certifications.filter((c) => !c.featured);

  return (
    <section id="certifications" className="py-24 sm:py-32 relative border-t border-surface-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-surface-border text-xs font-mono text-accent mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials · 7 Accreditations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-content-primary">
            Rigorous foundations. <br />
            <span className="font-semibold italic">Proven standards.</span>
          </h2>
          <p className="mt-3 text-content-secondary text-sm sm:text-base">
            Benchmarked against premier Microsoft engineering exams, enterprise simulations, and leading industry methodologies.
          </p>
        </div>

        {/* Featured DP-600 Hero Banner */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 rounded-3xl bg-gradient-to-r from-surface via-[#201E1D] to-surface border-2 border-accent/40 p-6 sm:p-10 shadow-[0_15px_45px_rgba(232,176,74,0.12)] relative overflow-hidden group"
          >
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-accent text-[#141313] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Featured Certification
                  </span>
                  <span className="text-xs font-mono text-accent font-semibold">
                    Score: {featured.score}
                  </span>
                  <span className="text-xs font-mono text-content-muted">
                    {featured.date} · Microsoft
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-semibold text-content-primary mb-3">
                  {featured.title}
                </h3>

                <p className="text-sm sm:text-base text-content-secondary leading-relaxed mb-6">
                  {featured.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {featured.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-full bg-surface-subtle border border-surface-border text-xs font-mono text-content-secondary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Score Seal */}
              <div className="shrink-0 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#141313]/80 border border-accent/30 text-center min-w-[200px]">
                <div className="w-14 h-14 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mb-3">
                  <Award className="w-7 h-7 text-accent" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted">
                  Official Score
                </span>
                <span className="font-mono text-3xl font-bold text-accent my-0.5">
                  919
                </span>
                <span className="text-[11px] font-mono text-content-secondary">
                  / 1000 Maximum
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Compact Grid of other 6 Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {others.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-5 rounded-2xl bg-surface-subtle/50 hover:bg-surface-subtle border border-surface-border hover:border-surface-border/90 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs font-mono text-content-muted">
                  <span className="text-accent">{cert.issuer}</span>
                  <span>{cert.date}</span>
                </div>

                <h4 className="text-lg font-medium text-content-primary mb-2">
                  {cert.title}
                </h4>

                {cert.description && (
                  <p className="text-xs text-content-secondary leading-relaxed mb-4">
                    {cert.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-border/40">
                {cert.skills.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded bg-surface-elevated/70 text-[10px] font-mono text-content-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


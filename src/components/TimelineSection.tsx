'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Award, Briefcase, GraduationCap, Laptop, Sparkles, CheckCircle2 } from 'lucide-react';
import { timeline, TimelineItem } from '@/data/timeline';
import { profile } from '@/data/profile';

export function TimelineSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const getIcon = (type: TimelineItem['roleType']) => {
    switch (type) {
      case 'Certification':
        return <Award className="w-4 h-4 text-accent" />;
      case 'Experience':
        return <Briefcase className="w-4 h-4 text-accent" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-accent" />;
      case 'Training':
        return <Laptop className="w-4 h-4 text-accent" />;
      case 'Internship':
        return <Sparkles className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <section id="story" className="py-24 sm:py-32 relative border-t border-surface-border/50 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Rolling Digit & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-surface-border text-xs font-mono text-accent mb-4">
              <History className="w-3.5 h-3.5" />
              <span>Chronological Narrative · 5 Milestones</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-content-primary">
              Let&apos;s go <span className="font-semibold italic">back in time.</span>
            </h2>
            <p className="mt-3 text-content-secondary text-sm sm:text-base max-w-2xl leading-relaxed">
              {profile.summary}
            </p>
          </div>

          {/* Active Milestone Counter */}
          <div className="flex items-center gap-4 bg-surface-subtle/70 border border-surface-border px-5 py-3 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                Milestone
              </span>
              <span className="font-mono text-2xl font-light text-accent">
                {timeline[activeIndex].order}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-surface-border" />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-content-muted block">
                Year
              </span>
              <span className="font-mono text-2xl font-semibold text-content-primary">
                {timeline[activeIndex].year}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Track & Cards */}
        <div className="relative">
          {/* Vertical central spine on tablet/desktop */}
          <div className="absolute top-0 bottom-0 left-4 sm:left-1/2 -translate-x-1/2 w-0.5 bg-surface-border/80 hidden sm:block" />

          <div className="space-y-12 sm:space-y-16">
            {timeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`relative flex flex-col sm:flex-row gap-6 sm:gap-12 items-start ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Central Node Badge */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-surface-subtle border-2 border-accent flex items-center justify-center z-10 shadow-[0_0_15px_rgba(232,176,74,0.3)]">
                    {getIcon(item.roleType)}
                  </div>

                  {/* Date Pillar */}
                  <div
                    className={`sm:w-1/2 pl-12 sm:pl-0 sm:pt-1 ${
                      isEven ? 'sm:text-left sm:pl-8' : 'sm:text-right sm:pr-8'
                    }`}
                  >
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono text-sm sm:text-base text-accent font-semibold">
                        {item.date}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-mono">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="block text-xs font-mono text-content-muted uppercase tracking-wider mt-0.5">
                      {item.organization}
                    </span>
                  </div>

                  {/* Content Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`sm:w-1/2 pl-12 sm:pl-0 w-full ${
                      isEven ? 'sm:pr-8' : 'sm:pl-8'
                    }`}
                  >
                    <div
                      className={`p-6 sm:p-7 rounded-2xl bg-surface-subtle/50 hover:bg-surface-subtle border border-surface-border hover:border-accent/60 transition-all duration-300 shadow-lg ${
                        activeIndex === index ? 'ring-1 ring-accent/50 bg-surface-subtle' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-accent">
                          {item.order} · {item.roleType}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-semibold text-content-primary mb-2">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-content-secondary leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Bullets */}
                      <ul className="space-y-2 mb-5">
                        {item.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="flex items-start gap-2.5 text-xs text-content-secondary leading-relaxed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-surface-border/50">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded bg-surface-elevated/70 border border-surface-border text-[10px] font-mono text-content-muted"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}


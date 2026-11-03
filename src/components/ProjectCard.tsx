'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, ShieldAlert, CheckCircle, Database } from 'lucide-react';
import { Project } from '@/data/projects';
import { ProjectVisualPlaceholder } from './ProjectVisualPlaceholder';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="rounded-3xl bg-surface-subtle/40 border border-surface-border p-6 sm:p-8 hover:border-accent/50 transition-all duration-300 shadow-xl flex flex-col justify-between"
    >
      <div>
        {/* Visual / Architecture Placeholder */}
        <div className="mb-6">
          <ProjectVisualPlaceholder
            type={project.placeholderType}
            title={project.title}
          />
        </div>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-surface-subtle border border-surface-border text-xs font-mono text-accent">
              {project.role}
            </span>
            {project.organization && (
              <span className="text-xs font-mono text-content-muted">
                {project.organization}
              </span>
            )}
          </div>

          {project.isCaseStudy ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
              <ShieldAlert className="w-3 h-3" />
              <span>Enterprise Case Study</span>
            </span>
          ) : (
            <span className="text-xs font-mono text-content-muted">
              Project #{index + 1}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-content-primary mb-3">
          {project.title}
        </h3>

        {/* Summary */}
        <p className="text-sm sm:text-base text-content-secondary leading-relaxed mb-6">
          {project.summary}
        </p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-surface-subtle/80 border border-surface-border/70">
          {project.metrics.map((m) => (
            <div key={m.label} className="flex flex-col">
              <span className="text-sm sm:text-base font-semibold font-mono text-content-primary">
                {m.value}
              </span>
              <span className="text-[11px] text-content-muted mt-0.5">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Technical Highlights */}
        <div className="space-y-2.5 mb-6">
          <span className="text-xs font-mono uppercase tracking-wider text-accent block">
            Technical Highlights
          </span>
          <ul className="space-y-2">
            {project.highlights.map((h, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-content-secondary leading-relaxed"
              >
                <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer: Tech Stack and Links */}
      <div className="pt-6 border-t border-surface-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Stack Badges */}
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md bg-surface-elevated border border-surface-border text-xs font-mono text-content-secondary"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-subtle hover:bg-surface-elevated border border-surface-border hover:border-accent text-xs font-mono text-content-primary transition-colors"
              title="View repository or profile"
            >
              <Github className="w-3.5 h-3.5 text-accent" />
              <span>GitHub (TODO link)</span>
              <ExternalLink className="w-3 h-3 text-content-muted" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}


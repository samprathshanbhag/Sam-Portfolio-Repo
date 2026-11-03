import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Database, Sparkles } from 'lucide-react';
import { projects } from '@/data/projects';
import { skillDoors } from '@/data/skills';
import { ProjectCard } from '@/components/ProjectCard';
import { ClosingCTA } from '@/components/ClosingCTA';

export const metadata: Metadata = {
  title: 'Data Modeling & Warehousing Portfolio | Samprath Shanbhag',
  description:
    'Star schemas, SCD Type 2 history tracking, and enterprise dimensional data warehousing in Microsoft Fabric by Samprath Shanbhag.',
};

export default function DataModelingPage() {
  const door = skillDoors.find((d) => d.id === 'data-modeling')!;
  const filteredProjects = projects.filter((p) =>
    p.categories.includes('data-modeling')
  );

  return (
    <div className="pt-28 sm:pt-36 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-xs font-mono text-content-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Doors & Wall</span>
        </Link>

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-surface-border text-xs font-mono text-accent mb-4">
            <Database className="w-3.5 h-3.5" />
            <span>Door 03 · Dimensional Modeling & Warehousing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-content-primary mb-6">
            {door.title}
          </h1>

          <p className="text-lg sm:text-xl text-content-secondary leading-relaxed mb-8">
            {door.description}
          </p>

          {/* Tools Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-surface-border/70">
            <span className="text-xs font-mono text-content-muted mr-2">Tools:</span>
            {door.tools.map((tool) => (
              <span
                key={tool}
                className="px-3 py-1 rounded-full bg-surface-subtle border border-surface-border text-xs font-mono text-accent font-medium"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="space-y-12">
          {filteredProjects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} />
          ))}
        </div>
      </div>

      <ClosingCTA />
    </div>
  );
}


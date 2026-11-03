import Link from 'next/link';
import { ArrowLeft, DatabaseZap, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 pt-20">
      <div className="p-4 rounded-2xl bg-surface-subtle border border-surface-border text-accent mb-6">
        <DatabaseZap className="w-10 h-10" />
      </div>

      <span className="text-xs font-mono text-accent uppercase tracking-widest mb-2">
        Error 404 · Query Result Empty
      </span>

      <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-content-primary mb-4">
        Record Not Found
      </h1>

      <p className="text-content-secondary max-w-md text-sm sm:text-base leading-relaxed mb-8">
        The table, door, or route you requested does not exist in the catalog or has been moved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-[#141313] font-medium text-sm transition-all shadow-[0_0_20px_rgba(232,176,74,0.25)]"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-subtle hover:bg-surface-elevated border border-surface-border text-content-primary text-sm font-mono transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-accent" />
          <span>Explore Skill Doors</span>
        </Link>
      </div>
    </div>
  );
}


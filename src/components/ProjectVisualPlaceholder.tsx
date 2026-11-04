'use client';

import React from 'react';
import {
  BarChart3,
  Layers,
  Database,
  Radio,
  Users,
  Sparkles,
  Info,
} from 'lucide-react';

interface PlaceholderProps {
  type: 'dashboard' | 'warehouse' | 'pipeline' | 'iot' | 'curriculum';
  title: string;
}

export function ProjectVisualPlaceholder({ type, title }: PlaceholderProps) {
  return (
    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1C1B1A] via-[#161515] to-[#100F0F] border border-surface-border p-5 flex flex-col justify-between group">
      {/* Swap notice banner */}
      <div className="flex items-center justify-between text-[11px] font-mono text-content-muted border-b border-surface-border/60 pb-3">
        <span className="flex items-center gap-1.5 text-accent">
          <Info className="w-3.5 h-3.5" />
          <span>PROJECT ARCHITECTURE PREVIEW</span>
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-surface-subtle text-amber-300/80 border border-amber-500/20">
          TODO: Swap with screenshot
        </span>
      </div>

      {/* Visual Graphic based on type */}
      <div className="my-auto py-4 flex flex-col items-center justify-center">
        {type === 'dashboard' && (
          <div className="w-full max-w-sm space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <div className="h-10 rounded-lg bg-surface-subtle border border-surface-border/70 p-2 flex flex-col justify-between">
                <span className="text-[9px] font-mono text-content-muted">REVENUE</span>
                <span className="text-xs font-mono font-bold text-accent">1.06M+</span>
              </div>
              <div className="h-10 rounded-lg bg-surface-subtle border border-surface-border/70 p-2 flex flex-col justify-between">
                <span className="text-[9px] font-mono text-content-muted">GROWTH</span>
                <span className="text-xs font-mono font-bold text-emerald-400">+24.8%</span>
              </div>
              <div className="h-10 rounded-lg bg-surface-subtle border border-surface-border/70 p-2 flex flex-col justify-between">
                <span className="text-[9px] font-mono text-content-muted">ORDERS</span>
                <span className="text-xs font-mono font-bold text-content-primary">54.2K</span>
              </div>
              <div className="h-10 rounded-lg bg-surface-subtle border border-surface-border/70 p-2 flex flex-col justify-between">
                <span className="text-[9px] font-mono text-content-muted">DQ FLAG</span>
                <span className="text-xs font-mono font-bold text-accent">Clean</span>
              </div>
            </div>
            {/* Chart Simulation */}
            <div className="h-20 w-full rounded-lg bg-surface-subtle border border-surface-border/70 p-3 flex items-end gap-2 justify-between">
              {[45, 62, 58, 80, 72, 95, 88, 100, 92, 110].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-accent/30 rounded-t group-hover:bg-accent transition-colors"
                  style={{ height: `${(h / 110) * 100}%` }}
                />
              ))}
            </div>
          </div>
        )}

        {type === 'warehouse' && (
          <div className="w-full max-w-sm flex items-center justify-between gap-3 font-mono text-[11px]">
            {/* Dimensions */}
            <div className="flex-1 p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-1.5">
              <div className="text-accent font-semibold flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>9 Dimensions</span>
              </div>
              <div className="text-[10px] text-content-muted">Dim_Customer (SCD2)</div>
              <div className="text-[10px] text-content-muted">Dim_Product</div>
              <div className="text-[10px] text-content-muted">Dim_Date & Target</div>
            </div>

            {/* Central Star Spine */}
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <div className="w-0.5 h-12 bg-accent/40" />
              <span className="text-[9px] text-accent font-mono">STAR</span>
            </div>

            {/* Facts */}
            <div className="flex-1 p-3 rounded-xl bg-surface-subtle border border-surface-border space-y-1.5">
              <div className="text-emerald-400 font-semibold flex items-center gap-1">
                <Layers className="w-3 h-3" />
                <span>10 Fact Tables</span>
              </div>
              <div className="text-[10px] text-content-muted">Fact_Sales</div>
              <div className="text-[10px] text-content-muted">Fact_AR_Collections</div>
              <div className="text-[10px] text-content-muted">Fact_Renewals</div>
            </div>
          </div>
        )}

        {type === 'pipeline' && (
          <div className="w-full max-w-sm flex items-center justify-between gap-2 font-mono text-[10px]">
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-600/40 text-amber-300 text-center flex-1">
              <div className="font-bold">BRONZE</div>
              <div className="text-[9px] text-amber-200/70">Raw Ingestion</div>
            </div>
            <div className="text-content-muted">➔</div>
            <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-600/40 text-slate-200 text-center flex-1">
              <div className="font-bold">SILVER</div>
              <div className="text-[9px] text-slate-400">DQ Cleaned</div>
            </div>
            <div className="text-content-muted">➔</div>
            <div className="p-2.5 rounded-lg bg-yellow-950/40 border border-yellow-500/50 text-yellow-300 text-center flex-1">
              <div className="font-bold">GOLD</div>
              <div className="text-[9px] text-yellow-200/70">Star Aggregations</div>
            </div>
          </div>
        )}

        {type === 'iot' && (
          <div className="w-full max-w-sm p-4 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Radio className="w-6 h-6 text-accent animate-pulse" />
              <div>
                <div className="text-xs font-mono font-semibold text-content-primary">
                  IoT Sensor Array
                </div>
                <div className="text-[10px] font-mono text-content-muted">
                  Pressure & vibration stream
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-emerald-400">95%</div>
              <div className="text-[9px] font-mono text-content-muted">Noise Suppressed</div>
            </div>
          </div>
        )}

        {type === 'curriculum' && (
          <div className="w-full max-w-sm p-4 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-accent" />
              <div>
                <div className="text-xs font-mono font-semibold text-content-primary">
                  Fabric Intern Mentorship
                </div>
                <div className="text-[10px] font-mono text-content-muted">
                  5-Month Structured Curriculum
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono font-bold text-accent">26 Interns</div>
              <div className="text-[9px] font-mono text-content-muted">Completed</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom descriptor */}
      <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between text-[10px] font-mono text-content-muted">
        <span>SPEC: {title.toUpperCase()}</span>
        <span>RESOLUTION: 1920 x 1080 READY</span>
      </div>
    </div>
  );
}


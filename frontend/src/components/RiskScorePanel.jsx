import React from 'react';

export default function RiskScorePanel({ score }) {
  let colorClass = 'text-ts-safe';
  if (score >= 3) colorClass = 'text-ts-warning';
  if (score >= 5) colorClass = 'text-ts-danger';

  return (
    <div className="bg-ts-surface border border-ts-border p-5 rounded shadow-sm">
      <h3 className="text-xs font-semibold text-ts-text-muted uppercase tracking-widest mb-3">Deterministic Risk Score</h3>
      <div className="flex items-center gap-6">
        <div className={`text-4xl font-display font-bold ${colorClass}`}>
          {score || 0}
        </div>
        <div className="flex-1">
          <div className="h-2 w-full bg-ts-bg rounded-full overflow-hidden">
            <div 
              className={`h-full ${score >= 5 ? 'bg-ts-danger' : score >= 3 ? 'bg-ts-warning' : 'bg-ts-safe'}`}
              style={{ width: `${Math.min(100, ((score || 0) / 10) * 100)}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-ts-text-muted mt-2 font-mono uppercase tracking-wide">
            Threshold: 5 = Block, 3 = Review
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function ReconstructionPanel({ logs }) {
  if (!logs || logs.length === 0) return null;
  
  return (
    <div className="bg-ts-surface border border-ts-border p-5 rounded shadow-sm">
      <h3 className="text-xs font-semibold text-ts-text-muted uppercase tracking-widest mb-3">Reconstruction Process</h3>
      <div className="flex flex-col gap-3">
        {logs.map((log, idx) => (
          <div key={idx} className="bg-ts-surface-soft border border-ts-border rounded p-3 text-sm text-ts-text-main border-l-[3px] border-l-ts-accent-primary">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

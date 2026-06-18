import React from 'react';

export default function ManualTokensPanel({ tokens }) {
  if (!tokens || tokens.length === 0) return null;

  return (
    <div className="bg-ts-surface border border-ts-border p-5 rounded shadow-sm">
      <h3 className="text-xs font-semibold text-ts-text-muted uppercase tracking-widest mb-3">Manual Tokenization</h3>
      <div className="flex flex-wrap gap-2">
        {tokens.map((token, idx) => (
          <div key={idx} className="bg-ts-surface-soft border border-ts-border text-ts-text-main px-3 py-1.5 rounded-full font-mono text-sm">
            {token}
          </div>
        ))}
      </div>
    </div>
  );
}

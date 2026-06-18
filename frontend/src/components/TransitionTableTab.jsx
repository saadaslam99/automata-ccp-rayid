import React from 'react';

export default function TransitionTableTab() {
  const transitions = [
    { state: 'q0', read: '[a-zA-Z]', action: 'Buffer char', movement: 'Head Right', next: 'q1', meaning: 'Start scanning word' },
    { state: 'q1', read: '[a-zA-Z]', action: 'Buffer char', movement: 'Head Right', next: 'q1', meaning: 'Continue word' },
    { state: 'q1', read: '␠ (Space)', action: 'Evaluate Buffer', movement: 'Head Right', next: 'q2', meaning: 'Possible word boundary' },
    { state: 'q2', read: '[a-zA-Z]', action: 'Check lookahead', movement: 'Head Right', next: 'q3', meaning: 'Suspicious split check' },
    { state: 'q3', read: 'Match dict', action: 'Merge buffers', movement: 'Head Reset', next: 'q4', meaning: 'Reconstruct broken word' },
    { state: 'q4', read: 'EOF', action: 'Halt & Score', movement: 'Halt', next: 'qsafe', meaning: 'Finish with reconstructed tokens' },
    { state: 'q2', read: '[!@#$]', action: 'Buffer symbol', movement: 'Head Right', next: 'qsuspicious', meaning: 'Symbol insertion detected' },
    { state: 'q0', read: '[!@#$]{3,}', action: 'Halt', movement: 'Halt', next: 'qinvalid', meaning: 'Too much noise to parse' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2 text-ts-text-main">Formal Transition Table</h2>
        <p className="text-ts-text-muted">The mapping function δ: Q × Σ → Q defining the exact Turing machine behavior.</p>
      </div>

      <div className="bg-ts-surface border border-ts-border rounded shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-ts-surface-soft border-b border-ts-border text-xs uppercase tracking-wider text-ts-text-muted">
            <tr>
              <th className="px-6 py-4 font-semibold">Current State (q)</th>
              <th className="px-6 py-4 font-semibold">Read Symbol (σ)</th>
              <th className="px-6 py-4 font-semibold">Action</th>
              <th className="px-6 py-4 font-semibold">Movement</th>
              <th className="px-6 py-4 font-semibold">Next State (δ)</th>
              <th className="px-6 py-4 font-semibold">Meaning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ts-border font-mono text-xs">
            {transitions.map((t, idx) => (
              <tr key={idx} className="hover:bg-ts-surface-soft/50 transition-colors">
                <td className="px-6 py-4 font-bold text-ts-accent-primary">{t.state}</td>
                <td className="px-6 py-4">{t.read}</td>
                <td className="px-6 py-4 text-ts-text-muted">{t.action}</td>
                <td className="px-6 py-4 text-ts-text-muted">{t.movement}</td>
                <td className="px-6 py-4 font-bold text-ts-accent-primary">{t.next}</td>
                <td className="px-6 py-4 text-ts-text-muted font-sans text-sm">{t.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

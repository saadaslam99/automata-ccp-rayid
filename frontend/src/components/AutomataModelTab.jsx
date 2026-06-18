import React from 'react';

export default function AutomataModelTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2 text-ts-text-main">Deterministic Finite Automaton (DFA) Model</h2>
        <p className="text-ts-text-muted">Formal definition and state transition mapping for the manual tokenization process.</p>
      </div>

      <div className="bg-ts-surface border border-ts-border p-8 rounded shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-widest mb-6 text-ts-accent-primary">State Definitions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 font-mono text-sm">
            <div className="flex gap-4">
              <span className="w-24 font-bold text-ts-text-main">q0</span>
              <span className="text-ts-text-muted">Start state. Awaiting first character.</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 font-bold text-ts-text-main">q1</span>
              <span className="text-ts-text-muted">Normal character scanning state.</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 font-bold text-ts-text-main">q2</span>
              <span className="text-ts-text-muted">Potential boundary detected (space/symbol).</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 font-bold text-ts-text-main">q3</span>
              <span className="text-ts-text-muted">Suspicious marker verification.</span>
            </div>
          </div>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex gap-4">
              <span className="w-24 font-bold text-ts-text-main">q4</span>
              <span className="text-ts-text-muted">Reconstruction triggered.</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 font-bold text-ts-safe">qsafe</span>
              <span className="text-ts-text-muted">Final state. Input is fully verified.</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 font-bold text-ts-warning">qsuspicious</span>
              <span className="text-ts-text-muted">Final state. Manipulation detected.</span>
            </div>
            <div className="flex gap-4">
              <span className="w-24 font-bold text-ts-danger">qinvalid</span>
              <span className="text-ts-text-muted">Final state. Unreadable noise stream.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

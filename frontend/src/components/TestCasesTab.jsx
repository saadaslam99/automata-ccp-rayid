import React from 'react';

export default function TestCasesTab() {
  const cases = [
    {
      id: 1,
      input: 'government policy update',
      expectedTokens: ['government', 'policy', 'update'],
      expectedRisk: '0',
      expectedDecision: 'SAFE',
      type: 'safe'
    },
    {
      id: 2,
      input: 'gove rnment policy update',
      expectedTokens: ['government', 'policy', 'update'],
      expectedRisk: '3',
      expectedDecision: 'REVIEW',
      type: 'warning'
    },
    {
      id: 3,
      input: 'gover#nment policy update',
      expectedTokens: ['government', 'policy', 'update'],
      expectedRisk: '5',
      expectedDecision: 'BLOCK',
      type: 'danger'
    },
    {
      id: 4,
      input: '@@@###%%%%',
      expectedTokens: ['None'],
      expectedRisk: '10',
      expectedDecision: 'INVALID',
      type: 'danger'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-2 text-ts-text-main">Automata Verification Cases</h2>
        <p className="text-ts-text-muted">Expected deterministic behavior mapped to specific manipulation inputs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((c) => {
          let badgeColor = 'bg-[#EAF3EF] text-[#3C8D6E] border-[#3C8D6E]';
          if (c.type === 'warning') badgeColor = 'bg-[#FDF6E9] text-[#D79A38] border-[#D79A38]';
          if (c.type === 'danger') badgeColor = 'bg-[#F9EBE9] text-[#C85B4A] border-[#C85B4A]';

          return (
            <div key={c.id} className="bg-ts-surface border border-ts-border rounded p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold text-ts-text-muted uppercase tracking-widest">Test Case 0{c.id}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-wider ${badgeColor}`}>
                  {c.expectedDecision}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] text-ts-text-muted uppercase tracking-wider mb-1">Raw Input</div>
                  <div className="font-mono text-sm bg-ts-surface-soft p-2 rounded border border-ts-border">{c.input}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-ts-text-muted uppercase tracking-wider mb-1">Expected Tokens</div>
                    <div className="font-mono text-xs text-ts-text-main">{c.expectedTokens.join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ts-text-muted uppercase tracking-wider mb-1">Expected Risk</div>
                    <div className="font-mono text-xs font-bold text-ts-text-main">{c.expectedRisk}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

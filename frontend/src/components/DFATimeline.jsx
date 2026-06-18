import React, { useEffect, useRef } from 'react';

export default function DFATimeline({ steps, activeIndex }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && activeIndex >= 0) {
      const activeEl = containerRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeIndex]);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="bg-ts-surface border border-ts-border p-5 rounded shadow-sm flex flex-col h-full max-h-[300px]">
      <h3 className="text-xs font-semibold text-ts-text-muted uppercase tracking-widest mb-3">DFA State Path</h3>
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2 font-mono text-[11px]"
      >
        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isPast = idx < activeIndex;
          
          if (!isActive && !isPast) return null;

          return (
            <div 
              key={idx} 
              className={`p-2 rounded border transition-colors ${
                isActive 
                  ? 'bg-ts-surface-soft border-ts-accent-primary text-ts-text-main' 
                  : 'bg-ts-bg border-ts-border text-ts-text-muted'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-ts-text-muted opacity-70">Step {idx + 1}</span>
                <span className={isActive ? 'text-ts-accent-primary font-bold' : ''}>
                  {step.currentState} &rarr; {step.nextState}
                </span>
              </div>
              <div className={step.nextState.includes('suspicious') || step.nextState.includes('invalid') ? 'text-ts-danger' : 'text-ts-text-muted'}>
                Reason: {step.reason}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

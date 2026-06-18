import React from 'react';
import tsLogo from '../assets/ts-logo.png';

export default function Header() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center overflow-hidden rounded shadow-sm bg-black border border-ts-border">
          <img src={tsLogo} alt="TS Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-semibold tracking-tight text-ts-text-main">TokenShield Studio</h1>
          <p className="text-sm text-ts-text-muted mt-0.5">Automata-Based Tokenization Firewall</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase border border-ts-border bg-ts-surface text-ts-text-muted rounded-full">
          Manual Tokenizer
        </span>
        <span className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase border border-ts-border bg-ts-surface text-ts-text-muted rounded-full">
          DFA Engine
        </span>
        <span className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase border border-ts-border bg-ts-surface text-ts-text-muted rounded-full">
          Risk Scoring
        </span>
        <span className="px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase border border-ts-border bg-ts-surface text-ts-text-muted rounded-full">
          LLM Context Layer
        </span>
      </div>
    </div>
  );
}

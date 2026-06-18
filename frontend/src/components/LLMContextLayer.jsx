import React from 'react';

export default function LLMContextLayer({ meaning }) {
  if (!meaning) return null;

  return (
    <div className="bg-[#F4F7F9] border border-[#305C73]/20 p-6 rounded shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">✨</span>
        <h3 className="text-xs font-semibold text-ts-accent-primary uppercase tracking-widest">LLM Context Layer</h3>
      </div>
      <div className="text-sm text-ts-text-main leading-relaxed space-y-3 font-serif">
        {meaning.split('\n').map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[#305C73]/10 text-[10px] text-ts-text-muted italic uppercase tracking-wide">
        The LLM only explains the final automata result. It does not tokenize, score, detect, or decide.
      </div>
    </div>
  );
}

import React from 'react';

export default function CharacterStreamViewer({ stream, activeIndex }) {
  if (!stream || stream.length === 0) return null;

  return (
    <div className="bg-ts-surface border border-ts-border p-5 rounded shadow-sm">
      <h3 className="text-xs font-semibold text-ts-text-muted uppercase tracking-widest mb-3">Character Stream</h3>
      <div className="flex flex-wrap gap-[2px] bg-ts-surface-soft p-3 rounded border border-ts-border font-mono text-sm max-h-[160px] overflow-y-auto">
        {stream.map((char, idx) => {
          const isActive = idx === activeIndex;
          const isSpaceOrSpecial = char === ' ' || /[^a-zA-Z0-9]/.test(char);
          
          let charClass = "w-6 h-8 flex items-center justify-center border transition-colors duration-100 ";
          
          if (isActive) {
            charClass += "border-ts-accent-primary bg-ts-accent-primary text-white ";
          } else {
            if (isSpaceOrSpecial) {
              charClass += "border-ts-warning/40 text-ts-warning bg-ts-warning/5 hover:bg-ts-warning/10 ";
            } else {
              charClass += "border-ts-border text-ts-text-main bg-ts-surface ";
            }
          }

          return (
            <div 
              key={idx} 
              className={charClass} 
              title={isSpaceOrSpecial ? "Suspicious boundary detected" : `Index: ${idx}`}
            >
              {char === ' ' ? '␣' : char}
            </div>
          );
        })}
      </div>
    </div>
  );
}

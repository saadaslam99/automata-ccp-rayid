import React from 'react';

export default function DecisionCard({ status, keywords }) {
  let colorStyles = 'bg-ts-surface border-ts-border text-ts-text-main';
  if (status?.includes('Safe')) colorStyles = 'bg-[#EAF3EF] border-[#3C8D6E] text-[#3C8D6E]';
  if (status?.includes('Review') || status?.includes('Suspicious')) colorStyles = 'bg-[#FDF6E9] border-[#D79A38] text-[#D79A38]';
  if (status?.includes('Block') || status?.includes('Invalid')) colorStyles = 'bg-[#F9EBE9] border-[#C85B4A] text-[#C85B4A]';

  return (
    <div className={`border-2 p-6 rounded shadow-sm flex flex-col items-center justify-center text-center transition-colors duration-500 ${colorStyles} h-full`}>
      <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">Automata Decision</h3>
      <div className="text-2xl font-display font-bold tracking-wide uppercase mb-3">
        {status || 'Pending'}
      </div>
      {keywords && keywords !== 'None' && (
        <div className="text-xs bg-white/50 px-3 py-1.5 rounded-full font-medium">
          Trigger: {keywords}
        </div>
      )}
    </div>
  );
}

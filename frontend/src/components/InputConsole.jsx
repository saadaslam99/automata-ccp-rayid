import React from 'react';

export default function InputConsole({ inputText, setInputText, onRun, isRunning, onReset }) {
  return (
    <div className="bg-ts-surface border border-ts-border p-6 rounded shadow-sm">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-ts-text-main uppercase tracking-wider">Input Stream</h2>
      </div>

      <textarea
        className="w-full h-32 bg-ts-bg border border-ts-border rounded p-4 text-ts-text-main font-mono text-sm focus:outline-none focus:border-ts-accent-primary focus:ring-1 focus:ring-ts-accent-primary resize-none transition-all"
        placeholder="Example: gove rnment policy update"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        disabled={isRunning}
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={onRun}
          disabled={isRunning || !inputText.trim()}
          className={`flex-1 py-2.5 px-4 rounded font-medium transition-colors ${
            isRunning 
              ? 'bg-ts-surface-soft text-ts-text-muted cursor-not-allowed border border-ts-border' 
              : 'bg-ts-accent-primary text-white hover:bg-opacity-90'
          }`}
        >
          {isRunning ? 'Analyzing...' : 'Analyze Input'}
        </button>
        <button
          onClick={onReset}
          disabled={isRunning}
          className="py-2.5 px-5 rounded font-medium border border-ts-border text-ts-text-muted hover:text-ts-text-main hover:bg-ts-surface-soft transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="pt-4 mt-4 border-t border-ts-border flex flex-col gap-2">
        <div className="text-[11px] text-ts-text-muted flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 bg-ts-accent-primary rounded-full"></span> Manual tokenization only
        </div>
        <div className="text-[11px] text-ts-text-muted flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 bg-ts-accent-primary rounded-full"></span> No regex matching
        </div>
        <div className="text-[11px] text-ts-text-muted flex items-center gap-2 font-mono">
          <span className="w-1.5 h-1.5 bg-ts-accent-primary rounded-full"></span> Character-by-character scanning
        </div>
      </div>
    </div>
  );
}

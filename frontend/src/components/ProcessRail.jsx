import React from 'react';
import { motion } from 'framer-motion';

export default function ProcessRail({ currentStepIndex }) {
  const steps = [
    { id: 0, label: 'Input Stream', desc: 'Raw text received' },
    { id: 1, label: 'Manual Tokens', desc: 'Basic space split' },
    { id: 2, label: 'DFA Scan', desc: 'Automata character processing' },
    { id: 3, label: 'Reconstruction', desc: 'Boundary repair' },
    { id: 4, label: 'Risk Score', desc: 'Deterministic point calc' },
    { id: 5, label: 'Decision', desc: 'Final automata state' },
    { id: 6, label: 'LLM Context', desc: 'Explanatory layer' }
  ];

  return (
    <div className="bg-ts-surface border border-ts-border rounded p-6 shadow-sm mb-6 flex overflow-x-auto">
      <div className="flex items-start w-full justify-between relative min-w-[700px]">
        {/* Connecting Line */}
        <div className="absolute top-[15px] left-[30px] right-[30px] h-[2px] bg-ts-border z-0"></div>
        
        {steps.map((step) => {
          const isActive = currentStepIndex === step.id;
          const isPast = currentStepIndex > step.id;
          
          let nodeColor = 'bg-ts-surface border-ts-border text-ts-text-muted';
          let labelColor = 'text-ts-text-muted';
          
          if (isActive) {
            nodeColor = 'bg-ts-surface border-ts-accent-primary text-ts-accent-primary ring-4 ring-ts-accent-primary/10';
            labelColor = 'text-ts-accent-primary font-medium';
          }
          if (isPast) {
            nodeColor = 'bg-ts-accent-primary border-ts-accent-primary text-white';
            labelColor = 'text-ts-text-main font-medium';
          }

          return (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: isActive || isPast ? 1 : 0.5 }}
              className="flex flex-col items-center gap-3 z-10 w-24 text-center"
            >
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-colors duration-300 ${nodeColor}`}>
                {isPast ? '✓' : (step.id + 1)}
              </div>
              <div>
                <div className={`text-[11px] uppercase tracking-wider mb-1 ${labelColor} transition-colors duration-300`}>
                  {step.label}
                </div>
                <div className="text-[10px] text-ts-text-muted leading-tight">
                  {step.desc}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppShell({ 
  header, 
  liveAnalysisTab, 
  automataModelTab, 
  transitionTableTab, 
  testCasesTab 
}) {
  const [activeTab, setActiveTab] = useState('live');

  const tabs = [
    { id: 'live', label: 'Live Analysis' },
    { id: 'model', label: 'Automata Model' },
    { id: 'table', label: 'Transition Table' },
    { id: 'tests', label: 'Test Cases' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-ts-bg font-sans text-ts-text-main selection:bg-ts-accent-primary selection:text-white">
      {/* Header Area */}
      <div className="border-b border-ts-border bg-ts-surface">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          {header}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-ts-border bg-ts-surface-soft">
        <div className="max-w-[1400px] mx-auto px-6 flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 text-sm font-medium relative transition-colors ${
                activeTab === tab.id ? 'text-ts-accent-primary' : 'text-ts-text-muted hover:text-ts-text-main'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-ts-accent-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'live' && (
            <motion.div 
              key="live"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {liveAnalysisTab}
            </motion.div>
          )}
          {activeTab === 'model' && (
            <motion.div 
              key="model"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {automataModelTab}
            </motion.div>
          )}
          {activeTab === 'table' && (
            <motion.div 
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {transitionTableTab}
            </motion.div>
          )}
          {activeTab === 'tests' && (
            <motion.div 
              key="tests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {testCasesTab}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

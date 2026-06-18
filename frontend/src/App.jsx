import React, { useState } from 'react';
import axios from 'axios';
import { adaptBackendDataToVarToken } from './utils/adapters';

import AppShell from './components/AppShell';
import Header from './components/Header';
import InputConsole from './components/InputConsole';
import ProcessRail from './components/ProcessRail';
import AutomataGraph3D from './components/AutomataGraph3D';
import ManualTokensPanel from './components/ManualTokensPanel';
import CharacterStreamViewer from './components/CharacterStreamViewer';
import DFATimeline from './components/DFATimeline';
import ReconstructionPanel from './components/ReconstructionPanel';
import RiskScorePanel from './components/RiskScorePanel';
import DecisionCard from './components/DecisionCard';
import LLMContextLayer from './components/LLMContextLayer';

import AutomataModelTab from './components/AutomataModelTab';
import TransitionTableTab from './components/TransitionTableTab';
import TestCasesTab from './components/TestCasesTab';

export default function App() {
  const [inputText, setInputText] = useState('gove rnment policy update');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState(null);
  
  // Pipeline steps: 0 (Raw), 1 (Tokens), 2 (DFA), 3 (Recon), 4 (Risk), 5 (Decision), 6 (LLM)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [charIndex, setCharIndex] = useState(-1);
  const [transitionIndex, setTransitionIndex] = useState(-1);
  const [activeState, setActiveState] = useState('q0');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setData(null);
    setCurrentStepIndex(-1);
    setCharIndex(-1);
    setTransitionIndex(-1);
    setActiveState('q0');
    
    try {
      const API_URL = import.meta.env.PROD ? '' : 'http://localhost:8081';
      const response = await axios.post(`${API_URL}/api/analyze`, { text: inputText });
      const adapted = adaptBackendDataToVarToken(response.data);
      setData(adapted);
      
      startAnimation(adapted);
    } catch (error) {
      console.error('API Error:', error);
      alert('Failed to connect to the backend server. Ensure it is running on port 8081.');
      setIsAnalyzing(false);
    }
  };

  const startAnimation = (adapted) => {
    let pipeline = 0;
    setCurrentStepIndex(pipeline);
    
    // Step 1: Character Stream & Manual Tokens
    setTimeout(() => {
      pipeline = 1;
      setCurrentStepIndex(pipeline);
      
      let charIdx = 0;
      const charInterval = setInterval(() => {
        setCharIndex(charIdx);
        charIdx++;
        
        if (charIdx > adapted.characterStream.length) {
          clearInterval(charInterval);
          
          // Step 2: DFA State Path
          pipeline = 2;
          setCurrentStepIndex(pipeline);
          
          let transIdx = 0;
          const transInterval = setInterval(() => {
            setTransitionIndex(transIdx);
            setActiveState(adapted.dfaStateTransitions[transIdx]?.currentState || 'q0');
            transIdx++;
            
            if (transIdx >= adapted.dfaStateTransitions.length) {
              clearInterval(transInterval);
              
              // Set final state based on status
              if (adapted.finalStatus.includes('Safe')) setActiveState('qsafe');
              else if (adapted.finalStatus.includes('Invalid')) setActiveState('qinvalid');
              else setActiveState('qsuspicious');

              // Step 3: Reconstruction
              setTimeout(() => {
                pipeline = 3;
                setCurrentStepIndex(pipeline);
                
                // Step 4: Risk
                setTimeout(() => {
                  pipeline = 4;
                  setCurrentStepIndex(pipeline);
                  
                  // Step 5: Decision
                  setTimeout(() => {
                    pipeline = 5;
                    setCurrentStepIndex(pipeline);
                    
                    // Step 6: LLM Context
                    setTimeout(() => {
                      pipeline = 6;
                      setCurrentStepIndex(pipeline);
                      setIsAnalyzing(false);
                    }, 1000);
                  }, 1000);
                }, 1000);
              }, 1000);
            }
          }, 400); // DFA speed
        }
      }, 150); // Char speed
    }, 1000);
  };

  const handleReset = () => {
    setInputText('');
    setIsAnalyzing(false);
    setData(null);
    setCurrentStepIndex(-1);
    setCharIndex(-1);
    setTransitionIndex(-1);
    setActiveState('q0');
  };

  const LiveAnalysisTab = (
    <div className="flex flex-col gap-5">
      
      {/* Top Row: Input and Process/Tokens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Input Console */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="h-full">
            <InputConsole 
              inputText={inputText}
              setInputText={setInputText}
              onRun={handleAnalyze}
              isRunning={isAnalyzing}
              onReset={handleReset}
            />
          </div>
        </div>

        {/* Process Rail & Streams */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <ProcessRail currentStepIndex={currentStepIndex} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">
            <div className="h-full">
              {data && currentStepIndex >= 1 && <ManualTokensPanel tokens={data.tapeCells} />}
            </div>
            <div className="h-full">
              {data && currentStepIndex >= 1 && <CharacterStreamViewer stream={data.characterStream} activeIndex={charIndex} />}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Main Area: Split Left and Right */}
      {/* Using items-start prevents the shorter column from stretching to the height of the taller column, eliminating the huge whitespace gaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Side: Graph, Risk, Decision, LLM */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {data && currentStepIndex >= 2 && (
            <AutomataGraph3D activeStateName={activeState} />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {data && currentStepIndex >= 4 && (
              <RiskScorePanel score={parseInt(data.detectedNoise.replace(/[^0-9]/g, '')) || 0} />
            )}
            {data && currentStepIndex >= 5 && (
              <DecisionCard status={data.finalStatus} keywords={data.detectedKeywords} />
            )}
          </div>

          {data && currentStepIndex >= 6 && (
            <LLMContextLayer meaning={data.llmMeaning} />
          )}
        </div>

        {/* Right Side: Timeline & Reconstruction */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {data && currentStepIndex >= 2 && (
            <DFATimeline steps={data.dfaStateTransitions} activeIndex={transitionIndex} />
          )}
          {data && currentStepIndex >= 3 && (
            <ReconstructionPanel logs={data.normalizationLog} />
          )}
        </div>

      </div>
    </div>
  );

  return (
    <AppShell
      header={<Header />}
      liveAnalysisTab={LiveAnalysisTab}
      automataModelTab={<AutomataModelTab />}
      transitionTableTab={<TransitionTableTab />}
      testCasesTab={<TestCasesTab />}
    />
  );
}

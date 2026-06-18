export const adaptBackendDataToVarToken = (backendData) => {
  if (!backendData) return null;

  const rawInput = backendData.originalInput || "";
  const characterStream = rawInput.split("");

  const dfaStateTransitions = (backendData.dfaSteps || []).map((step, idx) => ({
    id: idx,
    currentState: step.currentState,
    input: step.currentInput,
    nextState: step.nextState,
    reason: step.reason
  }));

  const tapeCells = (backendData.manualTokens || []).map(t => t.value);

  const normalizationLog = backendData.detectedIssues && backendData.detectedIssues.length > 0 && backendData.detectedIssues[0] !== 'None'
    ? backendData.detectedIssues 
    : ["No abnormal token boundaries detected."];

  const cleanTokens = (backendData.reconstructedText || "").split(" ").filter(t => t.trim().length > 0);

  return {
    originalInput: rawInput,
    characterStream,
    dfaStateTransitions,
    tapeCells,
    normalizationLog,
    cleanTokens,
    detectedLanguageType: "Automata-verified string",
    detectedNoise: `Risk Score: ${backendData.riskScore}`,
    detectedKeywords: backendData.detectedIssues.join(", "),
    finalStatus: backendData.decision,
    llmMeaning: backendData.llmContextMeaning
  };
};

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 1. Core Domain Models (Mimicking Java Enums)
// ==========================================
const CharType = {
    LETTER: 'LETTER',
    DIGIT: 'DIGIT',
    SPACE: 'SPACE',
    PUNCTUATION: 'PUNCTUATION',
    SYMBOL: 'SYMBOL',
    INVISIBLE_OR_CONTROL: 'INVISIBLE_OR_CONTROL',
    UNKNOWN: 'UNKNOWN'
};

const State = {
    q0: 'q0',
    q1: 'q1',
    q2: 'q2',
    q3: 'q3',
    q4: 'q4',
    qsafe: 'qsafe',
    qsuspicious: 'qsuspicious',
    qinvalid: 'qinvalid'
};

// ==========================================
// 2. Tokenizer (Manual Character Scanning)
// ==========================================
class Tokenizer {
    static getCharType(ch) {
        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) return CharType.LETTER;
        if (ch >= '0' && ch <= '9') return CharType.DIGIT;
        if (ch === ' ') return CharType.SPACE;
        if (ch === '.' || ch === ',' || ch === '?' || ch === '!') return CharType.PUNCTUATION;
        if (ch === '#' || ch === '@' || ch === '%' || ch === '*' || ch === '$' || ch === '&') return CharType.SYMBOL;
        if (ch.charCodeAt(0) < 32 || ch.charCodeAt(0) === 127) return CharType.INVISIBLE_OR_CONTROL;
        return CharType.UNKNOWN;
    }

    static tokenize(input) {
        const tokens = [];
        if (!input) return tokens;

        const chars = Array.from(input);
        let currentTokenValue = "";
        let currentType = Tokenizer.getCharType(chars[0]);

        for (let i = 0; i < chars.length; i++) {
            let ch = chars[i];
            let type = Tokenizer.getCharType(ch);

            if (type !== currentType) {
                if (currentTokenValue.length > 0) {
                    tokens.push({ value: currentTokenValue, type: currentType });
                    currentTokenValue = "";
                }
                currentType = type;
            }

            if (type === CharType.SPACE || type === CharType.SYMBOL || type === CharType.PUNCTUATION) {
                if (currentTokenValue.length > 0) {
                    tokens.push({ value: currentTokenValue, type: currentType });
                    currentTokenValue = "";
                }
                tokens.push({ value: ch, type: type });
                currentType = CharType.UNKNOWN;
            } else {
                currentTokenValue += ch;
            }
        }

        if (currentTokenValue.length > 0) {
            tokens.push({ value: currentTokenValue, type: currentType });
        }

        return tokens;
    }
}

// ==========================================
// 3. DFA Scanner (Manual State Transitions)
// ==========================================
class DFAScanner {
    static scan(tokens) {
        const steps = [];
        let currentState = State.q0;

        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            let nextState = currentState;
            let reason = "";

            switch (currentState) {
                case State.q0:
                    if (token.type === CharType.LETTER || token.type === CharType.DIGIT) {
                        nextState = State.q1;
                        reason = "Start normal scanning";
                    } else if (token.type === CharType.SYMBOL || token.type === CharType.PUNCTUATION || token.type === CharType.INVISIBLE_OR_CONTROL) {
                        nextState = State.qinvalid;
                        reason = "Noise detected at start";
                    }
                    break;
                case State.qinvalid:
                    nextState = State.qinvalid;
                    reason = "Unreadable noise stream";
                    break;
                case State.q1:
                    if (token.type === CharType.LETTER || token.type === CharType.DIGIT) {
                        nextState = State.q1;
                        reason = "Continue word";
                    } else if (token.type === CharType.SPACE || token.type === CharType.SYMBOL) {
                        nextState = State.q2;
                        reason = "Possible boundary";
                    }
                    break;
                case State.q2:
                    if (token.type === CharType.LETTER || token.type === CharType.DIGIT) {
                        nextState = State.q3;
                        reason = "Suspicious boundary";
                    } else if (token.type === CharType.SPACE || token.type === CharType.SYMBOL) {
                        nextState = State.q2;
                        reason = "Continue boundary";
                    }
                    break;
                case State.q3:
                    if (token.type === CharType.SPACE || token.type === CharType.PUNCTUATION) {
                        nextState = State.q4;
                        reason = "Begin reconstruction";
                    } else {
                        nextState = State.q3;
                        reason = "Continue suspicious word";
                    }
                    break;
                default:
                    break;
            }

            steps.push({
                currentInput: token.value,
                currentState: currentState,
                nextState: nextState,
                reason: reason
            });
            currentState = nextState;
        }

        if (currentState === State.q3) {
            steps.push({ currentInput: "END", currentState: currentState, nextState: State.q4, reason: "End of input, begin reconstruction" });
            currentState = State.q4;
        }

        if (currentState === State.q1 || currentState === State.q0 || currentState === State.q2) {
            steps.push({ currentInput: "END", currentState: currentState, nextState: State.qsafe, reason: "No suspicious boundaries detected" });
            currentState = State.qsafe;
        }

        return steps;
    }
}

// ==========================================
// 4. Reconstruction & Keyword Engine
// ==========================================
const PROTECTED_KEYWORDS = ["government", "policy", "admin", "login", "password", "system", "instruction"];

class KeywordMatcher {
    static findKeywords(text) {
        let lowerText = text.toLowerCase();
        return PROTECTED_KEYWORDS.filter(k => lowerText.includes(k));
    }
}

class ReconstructionEngine {
    static reconstruct(tokens) {
        if (!tokens || tokens.length === 0) return "";
        let processedTokens = [];

        let i = 0;
        while (i < tokens.length) {
            let t = tokens[i];

            if (t.type === CharType.LETTER) {
                let matchFound = false;

                for (let keyword of PROTECTED_KEYWORDS) {
                    let accumulated = "";
                    let j = i;
                    let tokensToConsume = 0;

                    while (j < tokens.length) {
                        let lookAheadToken = tokens[j];

                        if (lookAheadToken.type === CharType.LETTER) {
                            accumulated += lookAheadToken.value.toLowerCase();
                        } else if (lookAheadToken.type === CharType.SPACE || lookAheadToken.type === CharType.SYMBOL || lookAheadToken.type === CharType.PUNCTUATION || lookAheadToken.type === CharType.INVISIBLE_OR_CONTROL) {
                            // Separators are ignored while building the word
                        } else {
                            break;
                        }

                        tokensToConsume++;

                        if (accumulated === keyword) {
                            // Found the broken word! Replace all consumed tokens with the clean keyword
                            processedTokens.push({ value: keyword, type: CharType.LETTER });
                            i += tokensToConsume - 1; // Skip the broken tokens
                            matchFound = true;
                            break;
                        }

                        if (accumulated.length > keyword.length || !keyword.startsWith(accumulated)) {
                            break;
                        }

                        j++;
                    }
                    if (matchFound) break;
                }

                if (!matchFound) {
                    processedTokens.push(t);
                }
            } else {
                processedTokens.push(t);
            }
            i++;
        }

        return processedTokens.map(t => t.value).join('');
    }
}

// ==========================================
// 5. Risk Scorer
// ==========================================
class RiskScorer {
    static evaluate(tokens, reconstructedText) {
        let score = 0;
        let issues = [];
        let suspiciousMarkersCount = 0;

        for (let i = 0; i < tokens.length; i++) {
            let t = tokens[i];

            if (t.type === CharType.SYMBOL || t.type === CharType.INVISIBLE_OR_CONTROL) {
                if (i > 0 && i < tokens.length - 1) {
                    let prev = tokens[i - 1];
                    let next = tokens[i + 1];

                    if (prev.type === CharType.LETTER && next.type === CharType.LETTER) {
                        suspiciousMarkersCount++;
                        if (t.type === CharType.SYMBOL) {
                            score += 2;
                            issues.push("Symbol inserted inside word");
                        } else if (t.type === CharType.INVISIBLE_OR_CONTROL) {
                            score += 3;
                            issues.push("Invisible/control character inside word");
                        }
                    }
                }
            }
        }

        if (suspiciousMarkersCount > 1) {
            score += 2;
            issues.push("Multiple suspicious markers detected");
        }

        let totalNoiseTokens = tokens.filter(t => t.type === CharType.SYMBOL || t.type === CharType.PUNCTUATION || t.type === CharType.INVISIBLE_OR_CONTROL).length;
        if (totalNoiseTokens > 3) {
            score += 10;
            issues.push("Too much noise to parse");
        }

        let originalText = tokens.map(t => t.value).join('');
        let reconstructedKeywords = KeywordMatcher.findKeywords(reconstructedText);
        let originalKeywords = KeywordMatcher.findKeywords(originalText);

        // Find keywords that were exposed only AFTER reconstruction
        let hiddenKeywords = reconstructedKeywords.filter(k => !originalKeywords.includes(k));

        if (hiddenKeywords.length > 0) {
            score += 3;
            issues.push("Protected keyword matched after reconstruction");
        }

        let decision;
        if (totalNoiseTokens > 3) decision = "Invalid / Block";
        else if (score >= 5) decision = "Suspicious / Block";
        else if (score >= 3) decision = "Review";
        else decision = "Safe";

        if (issues.length === 0) issues.push("None");

        return { score, issues, decision };
    }
}

// ==========================================
// 6. Real LLM Context (Gemini API)
// ==========================================
class LLMExplainer {
    static async explain(originalInput, reconstructedText, riskScore, decision, reason) {
        if (!process.env.GEMINI_API_KEY) {
            return "Error: GEMINI_API_KEY is not set in the .env file.";
        }

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
            const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

            const prompt = `
You are the final translation layer for an automata-based tokenization attack detector.
You must NOT decide if the text is safe or suspicious. The automata has already decided that.
Your ONLY job is to explain the contextual meaning of the reconstructed text in simple language.

Automata Output:
Original Input: ${originalInput}
Reconstructed Input: ${reconstructedText}
Risk Score: ${riskScore}
Automata Decision: ${decision}
Reason: ${reason}

Provide a concise explanation (2-3 sentences max) based on this data. Explain what the input appears to mean, and briefly mention what the automata system detected.
`;
            const response = await ai.models.generateContent({
                model: modelName,
                contents: prompt,
            });
            return response.text;
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "LLM Error: " + error.message;
        }
    }
}

// ==========================================
// 7. Express API Controller
// ==========================================
app.post('/api/analyze', async (req, res) => {
    const input = req.body.text || "";

    const manualTokens = Tokenizer.tokenize(input);
    const dfaSteps = DFAScanner.scan(manualTokens);
    const reconstructedText = ReconstructionEngine.reconstruct(manualTokens);
    const risk = RiskScorer.evaluate(manualTokens, reconstructedText);

    const reason = risk.issues.join(", ");
    const llmContextMeaning = await LLMExplainer.explain(input, reconstructedText, risk.score, risk.decision, reason);

    res.json({
        originalInput: input,
        manualTokens: manualTokens,
        dfaSteps: dfaSteps,
        reconstructedText: reconstructedText,
        detectedIssues: risk.issues,
        riskScore: risk.score,
        decision: risk.decision,
        llmContextMeaning: llmContextMeaning
    });
});

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`TokenShield Node.js Backend running on port ${PORT}`);
});

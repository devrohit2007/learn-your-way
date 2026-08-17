// ai.js — Modular AI service
// Swap the provider here without touching app.js

const AI = (() => {

  // ── Config ──────────────────────────────────────────────
  // Set your API key and endpoint here, or wire up a backend proxy.
  // For the hackathon demo, leave API_KEY empty to use demo mode.
  const CONFIG = {
    API_KEY: '',           // Set your key here (or use a backend proxy)
    MODEL: 'claude-sonnet-4-6',
    ENDPOINT: 'https://api.anthropic.com/v1/messages',
    MAX_TOKENS: 800
  };

  // ── Prompts ─────────────────────────────────────────────
  const SYSTEM_PROMPT = `You are an adaptive learning assistant. Your only job is to explain concepts in different ways until the learner understands.

Rules:
- Be concise. Do not pad responses.
- Do not repeat the original text back.
- Do not say "Great question!" or add filler.
- Format depends on the mode requested.`;

  const MODE_PROMPTS = {
    simple: (text) => `Explain the following concept in simple, plain language. No jargon. Short sentences. Anyone should be able to understand it.

Concept: ${text}`,

    analogy: (text) => `Explain the following concept using a single clear real-world analogy. Make it concrete and relatable. Then briefly explain how the analogy maps to the concept.

Concept: ${text}`,

    visual: (text) => `Explain the following concept as a visual diagram using only text. Use boxes, arrows (↓ ↑ → ←), and labels to show relationships and flow. Then write one short sentence explaining what the diagram shows.

Concept: ${text}`,

    steps: (text) => `Break down the following concept into clear sequential steps. Number each step. Each step should be one sentence. Maximum 6 steps.

Concept: ${text}`
  };

  const PRACTICE_PROMPT = (text, mode) => `Based on this concept, generate exactly 3 multiple-choice practice questions.

Concept: ${text}
(Was explained using: ${mode} mode)

Return ONLY a JSON array, no markdown, no explanation:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "..."
  }
]

correct is the 0-based index of the right answer.`;

  // ── Core fetch ──────────────────────────────────────────
  async function callAPI(userMessage) {
    if (!CONFIG.API_KEY) {
      throw new Error('NO_API_KEY');
    }

    const response = await fetch(CONFIG.ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CONFIG.API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        max_tokens: CONFIG.MAX_TOKENS,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  // ── Public methods ──────────────────────────────────────
  async function explain(text, mode) {
    const prompt = MODE_PROMPTS[mode];
    if (!prompt) throw new Error('Unknown mode: ' + mode);
    return await callAPI(prompt(text));
  }

  async function generatePractice(text, mode) {
    const raw = await callAPI(PRACTICE_PROMPT(text, mode));
    // Strip any accidental markdown fences
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }

  async function generateQuiz(text, mode) {
    const raw = await callAPI(QUIZ_PROMPT(text, mode));
    const clean = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }

  return { explain, generatePractice, generateQuiz };

})();

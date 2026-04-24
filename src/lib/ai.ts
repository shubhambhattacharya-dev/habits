import { createGroq } from "@ai-sdk/groq";

export const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

// Primary model for complex analysis
export const THINKING_MODEL = "llama-3.3-70b-versatile";

// Fast model for quick responses
export const FAST_MODEL = "llama-3.1-8b-instant";

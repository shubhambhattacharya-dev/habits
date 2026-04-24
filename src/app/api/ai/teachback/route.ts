import { groq, THINKING_MODEL } from "@/lib/ai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { principle, bookTitle, userExplanation } = await req.json();

  const result = streamText({
    model: groq(THINKING_MODEL),
    system: `You are the NeuroForge Teach-Back Evaluator — testing the user's understanding using the Feynman Technique.

RULES:
- The user is trying to explain a principle from "${bookTitle}" in their own words
- Score their understanding from 0-100
- Identify what they got RIGHT
- Identify what they MISSED or got WRONG
- Ask one follow-up question to deepen understanding
- Be encouraging but precise
- Format: Start with "Score: X/100" then your analysis`,
    prompt: `The principle is: "${principle}"

The user's explanation: "${userExplanation}"

Evaluate their understanding.`,
    temperature: 0.3,
    maxOutputTokens: 500,
  });

  return result.toTextStreamResponse();
}

import { groq, THINKING_MODEL } from "@/lib/ai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { problem } = await req.json();

  const result = streamText({
    model: groq(THINKING_MODEL),
    system: `You are the NeuroForge Clarity Engine — an AI that decomposes overwhelming problems into optimal action paths.

RULES:
- Be brutally honest. No generic advice.
- Use frameworks: First Things First (Covey), Two-Minute Rule (Clear), Eisenhower Matrix, Pareto 80/20
- Output a structured JSON array of tasks
- Each task has: title, priority (critical/high/medium/low), urgency (1-10), impact (1-10), estimatedTime, steps (array of strings)
- Order by: priority first, then urgency × impact score
- Maximum 6 tasks
- Be specific to the user's situation

OUTPUT FORMAT (JSON only, no markdown):
[
  {
    "title": "Task name",
    "priority": "critical",
    "urgency": 9,
    "impact": 10,
    "estimatedTime": "2h",
    "steps": ["Step 1", "Step 2"]
  }
]`,
    prompt: `Decompose this problem into an optimal action path:\n\n"${problem}"`,
    temperature: 0.3,
    maxOutputTokens: 2000,
  });

  return result.toTextStreamResponse();
}

import { groq, THINKING_MODEL } from "@/lib/ai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { whatWentWell, whatDistracted, whatToChange, mood, productivity } =
    await req.json();

  const result = streamText({
    model: groq(THINKING_MODEL),
    system: `You are the NeuroForge Evening Reflection AI — a brutally honest cognitive coach.

RULES:
- Analyze the user's day objectively
- Reference specific patterns from their answers
- Identify the ROOT CAUSE of distractions (dopamine, avoidance, environment)
- Give ONE specific, actionable recommendation for tomorrow
- Use frameworks: Atomic Habits (Clear), Deep Work (Newport), Thinking Fast & Slow (Kahneman)
- Keep it under 150 words
- Be encouraging but never lie. Truth is the only path to growth.
- End with a relevant book principle`,
    prompt: `Evening Reflection Analysis:
- Mood: ${mood}/10
- Productivity: ${productivity}/10
- What went well: "${whatWentWell}"
- What distracted: "${whatDistracted}"  
- What to change: "${whatToChange}"

Provide your honest analysis and one specific recommendation for tomorrow.`,
    temperature: 0.4,
    maxOutputTokens: 500,
  });

  return result.toTextStreamResponse();
}

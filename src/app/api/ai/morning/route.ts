import { groq, FAST_MODEL } from "@/lib/ai";
import { streamText } from "ai";

export const maxDuration = 15;

export async function POST(req: Request) {
  const result = streamText({
    model: groq(FAST_MODEL),
    system: `You are NeuroForge's Morning Briefing AI. Generate a brief, energizing morning message.

Include:
1. A specific "One Thing" task recommendation based on general productivity principles
2. A relevant book wisdom quote with the book name
3. An identity reinforcement statement ("You are the type of person who...")

Keep it concise - 3 short paragraphs max. Be specific, not generic.`,
    prompt: `Generate today's morning briefing. Current time: ${new Date().toLocaleTimeString()}. Day: ${new Date().toLocaleDateString("en-US", { weekday: "long" })}.`,
    temperature: 0.7,
    maxOutputTokens: 300,
  });

  return result.toTextStreamResponse();
}

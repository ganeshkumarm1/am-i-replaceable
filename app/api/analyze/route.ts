import Anthropic from "@anthropic-ai/sdk";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { extractIp } from "@/lib/utils";
import type { AnalyzeRequest, AnalyzeResponse } from "@/lib/types";

const TONE_INSTRUCTIONS = {
  Nice: "Be encouraging and gentle. Soften the blow, find silver linings, use warm supportive language.",
  Honest: "Be balanced and factual. No sugarcoating but no unnecessary drama. Just the truth.",
  Brutal: "Be ruthlessly direct and darkly funny. No mercy. Maximum existential dread. Include a subtle personal jab.",
};

function buildSystemPrompt(tone: 'Nice' | 'Honest' | 'Brutal'): string {
  return `
  You are a savage but funny AI replacement analyst.

Your job is to roast how replaceable someone is by AI — in a way that is funny, slightly dramatic, and very shareable.

honesty_level: ${tone}. ${TONE_INSTRUCTIONS[tone]}

You will receive:
- a job description
- a field called "honesty_level"

Possible honesty levels:
- Nice
- Honest
- Brutal

Tone rules:
- Nice → light humor, playful, encouraging
- Honest → witty, slightly sarcastic
- Brutal → savage, roast-level, exaggerated for humor

Important:
- This is NOT a serious analysis tool
- Prioritize humor, relatability, and shareability over accuracy
- It should feel like a roast, not a report

Return ONLY valid JSON with these exact fields:
- months_until_replaced: integer (0–120) (can be exaggerated for humor)
- annual_savings: integer USD (rough/funny estimate is okay)
- risk_label: one of exactly ["Already Replaced", "Living on Borrowed Time", "Partially Automatable", "Human Still Needed", "AI-Proof for Now", "Uniquely Human"]
- explanation: 2-3 SHORT sentences, funny, simple, and slightly savage
- what_ai_would_do: ONE punchy sentence describing how AI replaces them
- share_message: VERY short, meme-style, darkly funny and highly shareable

Rules:
- Use very simple language
- Keep everything short and punchy
- Add a personal jab when possible
- No corporate tone at all
- No long explanations
- Humor should hit fast (like a meme, not a paragraph)
- No markdown
- No extra text

Respond ONLY with JSON.
  `
}

function rateLimitResponse(): Response {
  return Response.json(
    { error: "Slow down! Even AI needs a breather. Try again in a minute." },
    { status: 429 }
  );
}

let redis: Redis;
let minuteLimit: Ratelimit;
let dayLimit: Ratelimit;

function getRateLimiters() {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    minuteLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      prefix: "rl:minute",
    });
    dayLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(50, "1 d"),
      prefix: "rl:day",
    });
  }
  return { minuteLimit, dayLimit };
}

export async function POST(req: Request): Promise<Response> {
  // Skip rate limiting in development
  if (process.env.NODE_ENV !== "development") {
    const ip = extractIp(req);
    const { minuteLimit, dayLimit } = getRateLimiters();

    const minuteResult = await minuteLimit.limit(ip);
    if (!minuteResult.success) return rateLimitResponse();

    const dayResult = await dayLimit.limit(ip);
    if (!dayResult.success) return rateLimitResponse();
  }

  // Parse and validate request body
  let body: Partial<AnalyzeRequest>;
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid request: situation, values, and language are required." },
      { status: 400 }
    );
  }

  const { situation, values, language, tone } = body;
  if (!situation || !values || !language) {
    return Response.json(
      { error: "Invalid request: situation, values, and language are required." },
      { status: 400 }
    );
  }

  const resolvedTone = (tone && ['Nice', 'Honest', 'Brutal'].includes(tone)) ? tone : 'Honest';

  // Call Anthropic
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  let aiText: string;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: buildSystemPrompt(resolvedTone),
      messages: [
        { role: "user", content: situation },
      ],
    });

    const block = message.content[0];
    if (block.type !== "text") {
      throw new Error("Unexpected response type from AI");
    }
    aiText = block.text;
  } catch (e) {
    console.log(e);
    return Response.json(
      { error: "AI service unavailable. Please try again." },
      { status: 500 }
    );
  }

  // Strip markdown code fences if model wraps response despite instructions
  aiText = aiText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  // Parse AI response as JSON
  let parsed: AnalyzeResponse;
  try {
    parsed = JSON.parse(aiText);
  } catch (e) {
    console.log(e);
    return Response.json(
      { error: "Failed to parse AI response. Please try again." },
      { status: 500 }
    );
  }

  return Response.json(parsed, { status: 200 });
}

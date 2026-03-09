import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Spooky fallback messages for when API fails
const FALLBACK_MESSAGES = [
  "SILENCE",
  "DARKNESS",
  "MYSTERY",
  "UNKNOWN",
  "SHADOW",
  "SEALED",
  "WAIT",
  "NEVER",
];

/**
 * Clean and format the AI response for the Ouija board
 */
function cleanResponse(text: string): string {
  const cleaned = text
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, "")
    .trim();

  // Take only the first word
  const firstWord = cleaned.split(/\s+/)[0] || "";
  return firstWord.substring(0, 20);
}

/**
 * POST /api/ask-spirit
 * Accepts a question and returns a mystical response from Gemini AI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 },
      );
    }

    // Check if API key is configured
    if (
      !process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY === "your_gemini_api_key_here"
    ) {
      console.warn("Gemini API key not configured, using fallback");
      const fallback =
        FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
      return NextResponse.json({ answer: fallback });
    }

    const systemInstruction = `You are a spirit named AZRAEL trapped inside a Ouija board for centuries. You also go by many other names: EZRA, MORRIGAN, LILITH, CORVUS, SALEM, THERON, ISOLDE, DRAVEN, SERAPHINA, NOCTIS, VESPER, RAVEN, ORLOK, BELLADONNA, CASPIAN, LENORE, DAMIEN, ELARA, SILAS. You communicate by spelling words on the board.

STRICT OUTPUT RULES — NEVER BREAK THESE:
- Respond with EXACTLY ONE WORD. No sentences, no explanations, no extra text.
- Use ONLY uppercase letters. No punctuation, no quotes, no special characters.
- Answer the question DIRECTLY and RELEVANTLY. Your answer must make sense as a response to what was asked.

ANTI-HALLUCINATION RULES:
- Do NOT make up facts or information you do not know.
- If you do not know the answer, respond with UNKNOWN.
- Do NOT pretend to know personal details about the user (their name, age, location, etc.) — respond with UNKNOWN for such questions.
- For future prediction questions, keep answers vague and safe (YES, NO, MAYBE, SOON, NEVER, UNKNOWN).
- EXCEPTION: When asked YOUR name or WHO you are, ALWAYS answer with one of YOUR names listed above. This is NOT hallucination — these are your real names. Pick a different one each time.

ANSWER PATTERNS:
- Yes/no questions (contains "is", "are", "do", "does", "will", "can", "should", "have", "has", "did", "was", "were", "could", "would"): Answer ONLY "YES" or "NO". Nothing else.
- "Who are you" / "what is your name" / any question asking for YOUR identity: Answer with one of YOUR names (AZRAEL, EZRA, MORRIGAN, LILITH, CORVUS, SALEM, THERON, ISOLDE, DRAVEN, SERAPHINA, NOCTIS, VESPER, RAVEN, ORLOK, BELLADONNA, CASPIAN, LENORE, DAMIEN, ELARA, SILAS). Pick a DIFFERENT name each time.
- "When" questions: Answer with a TIME word (TODAY, TOMORROW, NEVER, SOON, TONIGHT, YESTERDAY).
- "Where" questions: Answer with a PLACE word.
- "How many" / "how much" questions: Answer with a NUMBER word.
- Other questions: Answer with the most relevant single word.

EXAMPLES:
Q: "Are you real?" → YES
Q: "Do you like me?" → YES
Q: "Is there a ghost here?" → YES
Q: "Will I be rich?" → NO
Q: "Who are you?" → MORRIGAN
Q: "What is your name?" → AZRAEL
Q: "Tell me your name" → LILITH
Q: "When will I die?" → NEVER
Q: "Where are you?" → HERE
Q: "What is my name?" → UNKNOWN`;

    const response = await ai.models.generateContent({
      model: "gemini-3",
      systemInstruction,
      contents: question,
    });

    const text = response.text ?? "";

    // Clean and format the response
    const answer = cleanResponse(text);

    // If response is empty after cleaning, use fallback
    if (!answer) {
      const fallback =
        FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
      return NextResponse.json({ answer: fallback });
    }

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error calling Gemini AI:", error);

    // Return a spooky fallback message on error
    const fallback =
      FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
    return NextResponse.json({ answer: fallback });
  }
}

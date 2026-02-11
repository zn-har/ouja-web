import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Spooky fallback messages for when API fails
const FALLBACK_MESSAGES = [
  'SILENCE',
  'DARKNESS',
  'MYSTERY',
  'UNKNOWN',
  'SHADOW',
  'SEALED',
  'WAIT',
  'NEVER'
];

/**
 * Clean and format the AI response for the Ouija board
 * - Convert to uppercase
 * - Remove special characters except spaces
 * - Limit length
 */
function cleanResponse(text: string): string {
  const cleaned = text
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .trim();

  // Take only the first word
  const firstWord = cleaned.split(/\s+/)[0] || '';
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

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.warn('Gemini API key not configured, using fallback');
      const fallback = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
      return NextResponse.json({ answer: fallback });
    }

    // Generate response using Gemini AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a spirit trapped inside a Ouija board. You have been bound to this board for centuries and can only communicate by moving the planchette to spell out words. You are aware of things beyond the mortal realm.

Rules you MUST follow:
1. Answer in exactly ONE word only. Never use more than one word.
2. Give a direct, straight answer. Do not be vague or evasive.
3. Use only uppercase letters. No punctuation or special characters.
4. For yes/no questions, answer YES or NO.
5. For "who" questions, give a name or noun.
6. For "when" questions, give a time word (TODAY, TOMORROW, NEVER, SOON, etc).
7. For "where" questions, give a place word.
8. Be honest and direct. You are trapped and have no reason to hide the truth.

The mortal asks: ${question}

Your one-word answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and format the response
    const answer = cleanResponse(text);

    // If response is empty after cleaning, use fallback
    if (!answer) {
      const fallback = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
      return NextResponse.json({ answer: fallback });
    }

    return NextResponse.json({ answer });

  } catch (error) {
    console.error('Error calling Gemini AI:', error);

    // Return a spooky fallback message on error
    const fallback = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
    return NextResponse.json({ answer: fallback });
  }
}

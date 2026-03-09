import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY === "your_gemini_api_key_here"
    ) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");

    const mimeType = audioFile.type || "audio/webm";

    const response = await ai.models.generateContent({
      model: "gemini-3",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Audio,
              },
            },
            {
              text: "Transcribe this audio exactly as spoken. Return ONLY the transcribed text, nothing else. No quotes, no labels, no explanations.",
            },
          ],
        },
      ],
    });

    const transcript = response.text?.trim() ?? "";

    if (!transcript) {
      return NextResponse.json(
        { error: "Could not transcribe audio" },
        { status: 400 },
      );
    }

    return NextResponse.json({ transcript });
  } catch (error: any) {
    console.error("Transcription error:", error);
    const message = error?.message || error?.toString() || "Unknown error";
    return NextResponse.json(
      { error: `Transcription failed: ${message}` },
      { status: 500 },
    );
  }
}

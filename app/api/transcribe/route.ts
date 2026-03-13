import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.GROQ_API_KEY ||
      process.env.GROQ_API_KEY === "your_groq_api_key_here"
    ) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
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

    // Groq Whisper expects a File object directly
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      language: "en",
    });

    const transcript = transcription.text?.trim() ?? "";

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

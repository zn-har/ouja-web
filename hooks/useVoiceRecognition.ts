"use client";

import { useState, useCallback, useRef, useEffect } from "react";

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  isTranscribing: boolean;
}

export function useVoiceRecognition(): UseVoiceRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasMediaDevices =
        typeof navigator.mediaDevices !== "undefined" &&
        typeof navigator.mediaDevices.getUserMedia === "function";
      const hasMediaRecorder = typeof window.MediaRecorder !== "undefined";
      setIsSupported(hasMediaDevices && hasMediaRecorder);
    }
  }, []);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  const startListening = useCallback(async () => {
    if (isListening || isTranscribing) return;

    setTranscript("");
    setError(null);
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stopStream();

        if (chunksRef.current.length === 0) {
          setError("No audio recorded. Try again.");
          return;
        }

        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];

        setIsTranscribing(true);
        try {
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          const data = await res.json();

          if (!res.ok) {
            setError(data.error || "Transcription failed.");
            return;
          }

          setTranscript(data.transcript);
        } catch {
          setError("Failed to transcribe. Check your connection.");
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.onerror = () => {
        setIsListening(false);
        stopStream();
        setError("Recording failed. Try again.");
      };

      recorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
    } catch (err: any) {
      stopStream();
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setError(
          "Microphone access denied. Allow mic access in browser settings.",
        );
      } else if (err.name === "NotFoundError") {
        setError("No microphone found. Connect a microphone.");
      } else {
        setError("Could not access microphone.");
      }
    }
  }, [isListening, isTranscribing, stopStream]);

  const stopListening = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    isTranscribing,
  };
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled: boolean;
}

export function VoiceButton({ onTranscript, disabled }: VoiceButtonProps) {
  const voice = useVoiceRecognition();
  const hasSubmittedRef = useRef(false);
  const isShiftHeldRef = useRef(false);

  // Hold Shift to talk: keydown starts recording, keyup stops.
  useEffect(() => {
    if (!voice.isSupported) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Shift") return;
      if (isShiftHeldRef.current || e.repeat) return;
      isShiftHeldRef.current = true;

      if (!disabled && !voice.isListening && !voice.isTranscribing) {
        voice.startListening();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key !== "Shift") return;
      isShiftHeldRef.current = false;

      if (voice.isListening) {
        voice.stopListening();
      }
    };

    const handleBlur = () => {
      isShiftHeldRef.current = false;
      if (voice.isListening) {
        voice.stopListening();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [
    disabled,
    voice.isListening,
    voice.isSupported,
    voice.isTranscribing,
    voice.startListening,
    voice.stopListening,
  ]);

  // Submit transcript when ready
  useEffect(() => {
    if (
      !voice.isListening &&
      !voice.isTranscribing &&
      voice.transcript &&
      !disabled &&
      !hasSubmittedRef.current
    ) {
      hasSubmittedRef.current = true;
      onTranscript(voice.transcript);
      voice.resetTranscript();
    }
  }, [
    voice.isListening,
    voice.isTranscribing,
    voice.transcript,
    disabled,
    onTranscript,
    voice.resetTranscript,
  ]);

  // Reset submission flag when starting a new recording
  useEffect(() => {
    if (voice.isListening) {
      hasSubmittedRef.current = false;
    }
  }, [voice.isListening]);

  if (!voice.isSupported) return null;

  return null;
}

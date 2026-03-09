"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled: boolean;
}

export function VoiceButton({ onTranscript, disabled }: VoiceButtonProps) {
  const voice = useVoiceRecognition();
  const [visible, setVisible] = useState(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSubmittedRef = useRef(false);

  // Auto-hide after 5 seconds of inactivity
  const resetHideTimer = useCallback(() => {
    setVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!voice.isListening && !voice.isTranscribing) {
        setVisible(false);
      }
    }, 5000);
  }, [voice.isListening, voice.isTranscribing]);

  useEffect(() => {
    const handleActivity = () => resetHideTimer();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("keydown", handleActivity);
    resetHideTimer();
    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [resetHideTimer]);

  // Keep visible while recording/transcribing
  useEffect(() => {
    if (voice.isListening || voice.isTranscribing) {
      setVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [voice.isListening, voice.isTranscribing]);

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

  const handleClick = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  if (!voice.isSupported) return null;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || voice.isTranscribing}
      className="voice-button"
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 100,
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        border: voice.isListening
          ? "2px solid rgba(220, 38, 38, 0.8)"
          : "2px solid rgba(212, 165, 116, 0.4)",
        background: voice.isListening
          ? "rgba(127, 29, 29, 0.6)"
          : voice.isTranscribing
            ? "rgba(120, 53, 15, 0.6)"
            : "rgba(14, 9, 6, 0.8)",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.5s ease",
        opacity: visible ? (disabled ? 0.3 : 1) : 0,
        pointerEvents: visible && !disabled ? "auto" : "none",
        transform: visible ? "scale(1)" : "scale(0.8)",
        boxShadow: voice.isListening
          ? "0 0 30px rgba(220, 38, 38, 0.4)"
          : voice.isTranscribing
            ? "0 0 30px rgba(217, 119, 6, 0.3)"
            : "0 0 20px rgba(212, 165, 116, 0.15)",
      }}
      title={
        voice.isTranscribing
          ? "Transcribing..."
          : voice.isListening
            ? "Stop listening"
            : "Ask with voice"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke={
          voice.isListening
            ? "#dc2626"
            : voice.isTranscribing
              ? "#d97706"
              : "#d4a574"
        }
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          width: "24px",
          height: "24px",
          animation:
            voice.isListening || voice.isTranscribing
              ? "pulse 1.5s ease-in-out infinite"
              : "none",
        }}
      >
        <rect x="9" y="1" width="6" height="11" rx="3" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    </button>
  );
}

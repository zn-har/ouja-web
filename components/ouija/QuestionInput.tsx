"use client";

import { useState, useEffect } from "react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled: boolean;
}

export function QuestionInput({ onSubmit, disabled }: QuestionInputProps) {
  const [question, setQuestion] = useState("");
  const voice = useVoiceRecognition();

  useEffect(() => {
    if (voice.transcript) {
      setQuestion(voice.transcript);
    }
  }, [voice.transcript]);

  useEffect(() => {
    if (!voice.isListening && !voice.isTranscribing && voice.transcript && !disabled) {
      onSubmit(voice.transcript);
      setQuestion("");
      voice.resetTranscript();
    }
  }, [voice.isListening, voice.isTranscribing, voice.transcript, disabled, onSubmit, voice.resetTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !disabled) {
      onSubmit(question);
      setQuestion("");
      voice.resetTranscript();
    }
  };

  const handleMicClick = () => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-10">
      <div className="flex flex-col gap-4">
        {/* Input row */}
        <div className="relative flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={disabled}
              placeholder={voice.isTranscribing ? "Transcribing..." : voice.isListening ? "Listening..." : "Ask the spirits a question..."}
              maxLength={100}
              className="w-full px-6 py-4 bg-[#0e0906] border border-amber-800/40 rounded-xl
                       text-amber-100 placeholder-amber-900/60 text-lg
                       focus:outline-none focus:border-amber-600/60 focus:ring-1 focus:ring-amber-600/30
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-500"
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: '18px',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
              }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-800/30 text-xs"
              style={{ fontFamily: "'Cinzel', serif" }}>
              {question.length}/100
            </div>
          </div>

          {/* Microphone button */}
          {voice.isSupported && (
            <button
              type="button"
              onClick={handleMicClick}
              disabled={disabled || voice.isTranscribing}
              className={`flex-shrink-0 w-14 h-14 rounded-xl border flex items-center justify-center
                         transition-all duration-500
                         disabled:opacity-40 disabled:cursor-not-allowed
                         ${voice.isListening
                           ? "bg-red-950/50 border-red-700/60 shadow-[0_0_25px_rgba(220,38,38,0.3)]"
                           : voice.isTranscribing
                             ? "bg-amber-950/50 border-amber-700/60 shadow-[0_0_25px_rgba(217,119,6,0.2)]"
                             : "bg-[#0e0906] border-amber-800/40 hover:border-amber-600/60 hover:shadow-[0_0_20px_rgba(217,119,6,0.2)]"
                         }`}
              title={voice.isTranscribing ? "Transcribing..." : voice.isListening ? "Stop listening" : "Ask with voice"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke={voice.isListening ? "#dc2626" : voice.isTranscribing ? "#d97706" : "#8b6914"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`w-5 h-5 ${voice.isListening || voice.isTranscribing ? 'animate-pulse' : ''}`}
              >
                <rect x="9" y="1" width="6" height="11" rx="3" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          )}
        </div>

        {/* Voice status */}
        {voice.error && (
          <p className="text-center text-red-400/70 text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
            {voice.error}
          </p>
        )}
        {voice.isListening && (
          <p className="text-center text-red-400/70 text-sm animate-pulse" style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic' }}>
            Speak your question to the spirits...
          </p>
        )}
        {voice.isTranscribing && (
          <p className="text-center text-amber-500/70 text-sm animate-pulse" style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic' }}>
            The spirits are deciphering your words...
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={disabled || !question.trim()}
          className="relative px-8 py-4 rounded-xl overflow-hidden
                   text-amber-200/90 font-semibold text-base
                   border border-amber-700/40
                   disabled:opacity-30 disabled:cursor-not-allowed
                   transition-all duration-500
                   hover:border-amber-600/60
                   active:scale-[0.98]
                   group"
          style={{
            fontFamily: "'Cinzel', serif",
            letterSpacing: '3px',
            background: 'linear-gradient(135deg, #1a0f07 0%, #2a1810 50%, #1a0f07 100%)',
          }}
        >
          {/* Button hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.15) 0%, transparent 70%)',
            }}
          />
          <span className="relative z-10">
            {disabled ? "SPIRITS ARE SPEAKING" : "ASK THE SPIRITS"}
          </span>
        </button>

        {/* Active session indicator */}
        {disabled && (
          <div className="text-center">
            <p className="text-amber-600/40 text-sm animate-pulse" style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic' }}>
              The coin is moving... watch carefully...
            </p>
          </div>
        )}
      </div>
    </form>
  );
}

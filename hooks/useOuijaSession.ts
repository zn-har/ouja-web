"use client";

import { useState, useCallback } from "react";
import { Message } from "@/types/ouija";

interface SessionState {
  messages: Message[];
  isAsking: boolean;
  currentAnswer: string;
  error: string | null;
}

interface UseOuijaSessionProps {
  onCharacterChange: (char: string) => Promise<void>;
  onComplete: () => void;
}

export function useOuijaSession({
  onCharacterChange,
  onComplete,
}: UseOuijaSessionProps) {
  const [state, setState] = useState<SessionState>({
    messages: [],
    isAsking: false,
    currentAnswer: "",
    error: null,
  });

  /**
   * Ask the spirits a question
   */
  const askSpirit = useCallback(
    async (question: string): Promise<void> => {
      if (!question.trim()) {
        return;
      }

      setState((prev) => ({
        ...prev,
        isAsking: true,
        currentAnswer: "",
        error: null,
      }));

      try {
        // Fetch answer from API
        const response = await fetch("/api/ask-spirit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: question.trim() }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from spirits");
        }

        const data = await response.json();
        const answer = data.answer || "UNKNOWN";

        setState((prev) => ({ ...prev, currentAnswer: answer }));

        // Move to START position
        await onCharacterChange("START");
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Animate through each character
        for (let i = 0; i < answer.length; i++) {
          const char = answer[i];

          // Skip spaces
          if (char === " ") {
            await new Promise((resolve) => setTimeout(resolve, 400));
            continue;
          }

          await onCharacterChange(char);
          await new Promise((resolve) => setTimeout(resolve, 800));
        }

        // Move to GOODBYE
        await new Promise((resolve) => setTimeout(resolve, 500));
        await onCharacterChange("GOODBYE");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Add to message history
        const message: Message = {
          question,
          answer,
          timestamp: Date.now(),
        };

        setState((prev) => ({
          ...prev,
          messages: [message, ...prev.messages],
          isAsking: false,
          currentAnswer: "",
        }));

        onComplete();
      } catch (error) {
        console.error("Error asking spirit:", error);
        setState((prev) => ({
          ...prev,
          isAsking: false,
          error: "The spirits are not responding. Try again later.",
          currentAnswer: "",
        }));
      }
    },
    [onCharacterChange, onComplete],
  );

  /**
   * Clear message history
   */
  const clearHistory = useCallback(() => {
    setState((prev) => ({ ...prev, messages: [] }));
  }, []);

  return {
    messages: state.messages,
    isAsking: state.isAsking,
    currentAnswer: state.currentAnswer,
    error: state.error,
    askSpirit,
    clearHistory,
  };
}

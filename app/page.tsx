"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { usePlanchette } from "@/hooks/usePlanchette";
import { useOuijaSession } from "@/hooks/useOuijaSession";
import { Planchette } from "@/components/ouija/Planchette";
import { VoiceButton } from "@/components/ouija/VoiceButton";

declare global {
  interface Window {
    __ouijaDebug: (text: string) => void;
    __ouijaMoveTo: (char: string) => void;
  }
}

export default function Home() {
  const planchette = usePlanchette();

  const session = useOuijaSession({
    onCharacterChange: planchette.animateToCharacter,
    onComplete: planchette.reset,
  });

  // Store animateToCharacter in a ref so the debug functions always use the latest
  const animateRef = useRef(planchette.animateToCharacter);
  animateRef.current = planchette.animateToCharacter;

  const resetRef = useRef(planchette.reset);
  resetRef.current = planchette.reset;

  // Expose debug functions on window for console testing
  useEffect(() => {
    /**
     * Usage from browser console:
     *   __ouijaDebug("HELLO")   — animates coin: START → H → E → L → L → O → GOODBYE
     *   __ouijaMoveTo("A")      — moves coin to a single character/position
     */
    window.__ouijaDebug = (text: string) => {
      const answer = text.toUpperCase();
      console.log(`🔮 [Ouija Debug] Animating: "${answer}"`);

      (async () => {
        // Move to START
        await animateRef.current("START");
        await new Promise((r) => setTimeout(r, 500));

        for (let i = 0; i < answer.length; i++) {
          const char = answer[i];
          if (char === " ") {
            await new Promise((r) => setTimeout(r, 400));
            continue;
          }
          console.log(`🔮 [Ouija Debug] → ${char}`);
          await animateRef.current(char);
          await new Promise((r) => setTimeout(r, 800));
        }

        // Move to GOODBYE
        await new Promise((r) => setTimeout(r, 500));
        await animateRef.current("GOODBYE");
        await new Promise((r) => setTimeout(r, 1000));

        console.log("🔮 [Ouija Debug] Done.");
        resetRef.current();
      })();
    };

    window.__ouijaMoveTo = (char: string) => {
      console.log(`🔮 [Ouija Debug] Moving to: "${char.toUpperCase()}"`);
      animateRef.current(char.toUpperCase());
    };

    return () => {
      delete (window as any).__ouijaDebug;
      delete (window as any).__ouijaMoveTo;
    };
  }, []);

  const handleVoiceTranscript = useCallback(
    (text: string) => {
      session.askSpirit(text);
    },
    [session.askSpirit],
  );

  // Settings button visibility
  const [showSettings, setShowSettings] = useState(true);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      setShowSettings(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowSettings(false), 5000);
    };
    window.addEventListener("mousemove", show);
    window.addEventListener("touchstart", show);
    timer = setTimeout(() => setShowSettings(false), 5000);
    return () => {
      window.removeEventListener("mousemove", show);
      window.removeEventListener("touchstart", show);
      clearTimeout(timer);
    };
  }, []);

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Planchette — the only visible projected element */}
      <Planchette
        position={planchette.position}
        rotation={planchette.rotation}
        isMoving={planchette.isMoving}
      />

      {/* Voice-only interaction button */}
      <VoiceButton
        onTranscript={handleVoiceTranscript}
        disabled={session.isAsking}
      />

      {/* Calibrate button — auto-hides with settings */}
      <a
        href="/calibrate"
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: 100,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid rgba(212, 165, 116, 0.2)",
          background: "rgba(14, 9, 6, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          transition: "all 0.5s ease",
          opacity: showSettings ? 0.6 : 0,
          pointerEvents: showSettings ? "auto" : "none",
          transform: showSettings ? "scale(1)" : "scale(0.8)",
        }}
        title="Calibrate positions"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d4a574"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </a>
    </main>
  );
}

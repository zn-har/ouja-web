"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Position } from "@/types/ouija";
import {
  saveCalibration,
  loadCalibration,
  getDefaultPositionsPercent,
  clearCalibration,
} from "@/utils/calibrationStore";

const ALL_ELEMENTS = [
  ...("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")),
  ..."1234567890".split(""),
  "YES",
  "NO",
  "GOODBYE",
];

export default function CalibratePage() {
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load positions on mount
  useEffect(() => {
    const calibration = loadCalibration();
    if (calibration) {
      setPositions(calibration.positions);
    } else {
      setPositions(getDefaultPositionsPercent());
    }
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, char: string) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setDragging(char);
      setShowHelp(false);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setPositions((prev) => ({
        ...prev,
        [dragging]: {
          x: Math.max(0, Math.min(100, x)),
          y: Math.max(0, Math.min(100, y)),
        },
      }));
    },
    [dragging],
  );

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleSave = () => {
    saveCalibration({
      positions: { ...positions, START: positions["START"] || getDefaultPositionsPercent()["START"] },
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      savedAt: Date.now(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    clearCalibration();
    setPositions(getDefaultPositionsPercent());
  };

  const handleGoBack = () => {
    window.location.href = "/";
  };

  if (Object.keys(positions).length === 0) return null;

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "#000",
        overflow: "hidden",
        cursor: dragging ? "grabbing" : "default",
        touchAction: "none",
      }}
    >
      {/* Grid overlay for alignment */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.08,
        }}
      >
        {/* Vertical lines */}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={`${(i + 1) * 10}%`}
            y1="0"
            x2={`${(i + 1) * 10}%`}
            y2="100%"
            stroke="#d4a574"
            strokeWidth="1"
          />
        ))}
        {/* Horizontal lines */}
        {Array.from({ length: 9 }, (_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={`${(i + 1) * 10}%`}
            x2="100%"
            y2={`${(i + 1) * 10}%`}
            stroke="#d4a574"
            strokeWidth="1"
          />
        ))}
        {/* Center crosshair */}
        <line x1="50%" y1="45%" x2="50%" y2="55%" stroke="#d4a574" strokeWidth="2" opacity="0.5" />
        <line x1="45%" y1="50%" x2="55%" y2="50%" stroke="#d4a574" strokeWidth="2" opacity="0.5" />
      </svg>

      {/* Draggable elements */}
      {ALL_ELEMENTS.map((char) => {
        const pos = positions[char];
        if (!pos) return null;
        const isControl = char.length > 1;
        const isNumber = /^\d$/.test(char);
        const isActive = dragging === char;

        return (
          <div
            key={char}
            onPointerDown={(e) => handlePointerDown(e, char)}
            style={{
              position: "absolute",
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: "translate(-50%, -50%)",
              cursor: isActive ? "grabbing" : "grab",
              userSelect: "none",
              touchAction: "none",
              zIndex: isActive ? 100 : isControl ? 20 : 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: isControl ? "60px" : "36px",
              minHeight: "36px",
              borderRadius: "8px",
              background: isActive
                ? "rgba(212, 165, 116, 0.2)"
                : "rgba(212, 165, 116, 0.05)",
              border: isActive
                ? "2px solid rgba(212, 165, 116, 0.8)"
                : "1px solid rgba(212, 165, 116, 0.2)",
              padding: isControl ? "4px 12px" : "4px 8px",
              transition: isActive ? "none" : "background 0.2s, border 0.2s",
              boxShadow: isActive
                ? "0 0 20px rgba(212, 165, 116, 0.4)"
                : "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: isControl ? "14px" : isNumber ? "16px" : "20px",
                fontWeight: "bold",
                color: isActive
                  ? "#f0d060"
                  : isControl
                    ? "#d4a574"
                    : isNumber
                      ? "#a0785a"
                      : "#d4a574",
                letterSpacing: isControl ? "2px" : "0",
                textShadow: isActive
                  ? "0 0 10px rgba(240, 208, 96, 0.6)"
                  : "none",
                pointerEvents: "none",
              }}
            >
              {char}
            </span>
          </div>
        );
      })}

      {/* Help overlay */}
      {showHelp && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(14, 9, 6, 0.95)",
            border: "1px solid rgba(212, 165, 116, 0.3)",
            borderRadius: "16px",
            padding: "32px 40px",
            maxWidth: "420px",
            textAlign: "center",
            zIndex: 200,
          }}
        >
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              color: "#d4a574",
              fontSize: "20px",
              marginBottom: "16px",
              letterSpacing: "3px",
            }}
          >
            CALIBRATION MODE
          </h2>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              color: "rgba(212, 165, 116, 0.7)",
              fontSize: "16px",
              lineHeight: "1.6",
              marginBottom: "8px",
            }}
          >
            Drag each letter and number to match the position on your physical Ouija board.
          </p>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              color: "rgba(212, 165, 116, 0.5)",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            The grid lines help with alignment. Click <strong>Save</strong> when done. Positions are saved in your browser.
          </p>
          <button
            onClick={() => setShowHelp(false)}
            style={{
              marginTop: "20px",
              fontFamily: "'Cinzel', serif",
              fontSize: "13px",
              color: "#d4a574",
              background: "rgba(212, 165, 116, 0.1)",
              border: "1px solid rgba(212, 165, 116, 0.3)",
              borderRadius: "8px",
              padding: "8px 24px",
              cursor: "pointer",
              letterSpacing: "2px",
            }}
          >
            GOT IT
          </button>
        </div>
      )}

      {/* Top toolbar */}
      <div
        style={{
          position: "fixed",
          top: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "12px",
          zIndex: 150,
        }}
      >
        <button
          onClick={handleGoBack}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            color: "rgba(212, 165, 116, 0.7)",
            background: "rgba(14, 9, 6, 0.9)",
            border: "1px solid rgba(212, 165, 116, 0.2)",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            letterSpacing: "2px",
            transition: "all 0.3s",
          }}
        >
          ← BACK
        </button>
        <button
          onClick={handleReset}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            color: "rgba(212, 165, 116, 0.7)",
            background: "rgba(14, 9, 6, 0.9)",
            border: "1px solid rgba(212, 165, 116, 0.2)",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            letterSpacing: "2px",
            transition: "all 0.3s",
          }}
        >
          RESET
        </button>
        <button
          onClick={handleSave}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            color: saved ? "#000" : "#d4a574",
            background: saved
              ? "rgba(212, 165, 116, 0.9)"
              : "rgba(14, 9, 6, 0.9)",
            border: saved
              ? "1px solid #d4a574"
              : "1px solid rgba(212, 165, 116, 0.4)",
            borderRadius: "8px",
            padding: "8px 20px",
            cursor: "pointer",
            letterSpacing: "2px",
            fontWeight: "bold",
            transition: "all 0.3s",
          }}
        >
          {saved ? "✓ SAVED" : "SAVE"}
        </button>
      </div>

      {/* Currently dragging indicator */}
      {dragging && (
        <div
          style={{
            position: "fixed",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Cinzel', serif",
            fontSize: "12px",
            color: "#f0d060",
            background: "rgba(14, 9, 6, 0.9)",
            border: "1px solid rgba(240, 208, 96, 0.3)",
            borderRadius: "8px",
            padding: "6px 16px",
            letterSpacing: "2px",
            zIndex: 150,
          }}
        >
          MOVING: {dragging} ({positions[dragging]?.x.toFixed(1)}%, {positions[dragging]?.y.toFixed(1)}%)
        </div>
      )}
    </div>
  );
}

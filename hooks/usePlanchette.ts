"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Position } from "@/types/ouija";
import { loadCalibration, getDefaultPositionsPercent } from "@/utils/calibrationStore";

/**
 * Build the element map from calibration data.
 * Positions are in viewport percentages (0-100).
 */
function buildElementMap(): Map<string, Position> {
  const calibration = loadCalibration();
  const positions = calibration?.positions ?? getDefaultPositionsPercent();

  const map = new Map<string, Position>();
  Object.entries(positions).forEach(([char, pos]) => {
    map.set(char, pos);
  });

  return map;
}

/**
 * Calculate rotation angle from one position to another
 */
function calculateRotation(from: Position, to: Position): number {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
}

export function usePlanchette() {
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const [rotation, setRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const positionRef = useRef<Position>({ x: 50, y: 50 });
  const elementMapRef = useRef<Map<string, Position>>(new Map());

  // Load calibration on mount
  useEffect(() => {
    elementMapRef.current = buildElementMap();
    const startPos = elementMapRef.current.get("START") ?? { x: 50, y: 50 };
    positionRef.current = startPos;
    setPosition(startPos);
  }, []);

  const animateToCharacter = useCallback(
    async (char: string): Promise<void> => {
      const targetPosition = elementMapRef.current.get(char.toUpperCase());

      if (!targetPosition) {
        console.warn(`Position not found for character: ${char}`);
        return;
      }

      const newRotation = calculateRotation(positionRef.current, targetPosition);

      positionRef.current = targetPosition;
      setPosition(targetPosition);
      setRotation(newRotation);
      setIsMoving(true);

      // Wait for spring animation to settle
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsMoving(false);
    },
    [],
  );

  const moveToStart = useCallback(async (): Promise<void> => {
    await animateToCharacter("START");
  }, [animateToCharacter]);

  const reset = useCallback(() => {
    const startPos = elementMapRef.current.get("START") ?? { x: 50, y: 50 };
    positionRef.current = startPos;
    setPosition(startPos);
    setRotation(0);
    setIsMoving(false);
  }, []);

  return {
    position,
    rotation,
    isMoving,
    animateToCharacter,
    moveToStart,
    reset,
  };
}

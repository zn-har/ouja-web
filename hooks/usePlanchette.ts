'use client';

import { useState, useCallback, useRef } from 'react';
import { Position } from '@/types/ouija';
import { getAllBoardElements, calculateRotation } from '@/utils/boardPositions';

const boardData = getAllBoardElements();

export function usePlanchette() {
  const [position, setPosition] = useState<Position>({ x: 400, y: 300 });
  const [rotation, setRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const positionRef = useRef<Position>({ x: 400, y: 300 });

  const animateToCharacter = useCallback(async (char: string): Promise<void> => {
    const targetPosition = boardData.elementMap.get(char.toUpperCase());

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
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsMoving(false);
  }, []);

  const moveToStart = useCallback(async (): Promise<void> => {
    await animateToCharacter('START');
  }, [animateToCharacter]);

  const reset = useCallback(() => {
    const center = { x: 400, y: 300 };
    positionRef.current = center;
    setPosition(center);
    setRotation(0);
    setIsMoving(false);
  }, []);

  return {
    position,
    rotation,
    isMoving,
    animateToCharacter,
    moveToStart,
    reset
  };
}

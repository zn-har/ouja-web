"use client";

import { Position } from "@/types/ouija";

const STORAGE_KEY = "ouija-calibration";

export interface CalibrationData {
  /** Maps char (A-Z, 0-9, YES, NO, GOODBYE, START) -> { x, y } in viewport percentage (0-100) */
  positions: Record<string, Position>;
  /** Viewport width at calibration time */
  viewportWidth: number;
  /** Viewport height at calibration time */
  viewportHeight: number;
  /** Timestamp of last save */
  savedAt: number;
}

/**
 * Save calibration positions to localStorage
 */
export function saveCalibration(data: CalibrationData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save calibration:", e);
  }
}

/**
 * Load calibration from localStorage. Returns null if none saved.
 */
export function loadCalibration(): CalibrationData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CalibrationData;
  } catch {
    return null;
  }
}

/**
 * Check if calibration data exists
 */
export function hasCalibration(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Clear saved calibration
 */
export function clearCalibration(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear calibration:", e);
  }
}

/**
 * Get the default positions for all board elements in viewport percentage (0-100).
 * These mirror the existing boardPositions.ts layout but expressed as percentages.
 */
export function getDefaultPositionsPercent(): Record<string, Position> {
  const VIEWBOX_W = 800;
  const VIEWBOX_H = 600;
  const CENTER_X = VIEWBOX_W / 2;
  const CENTER_Y = VIEWBOX_H / 2;

  const positions: Record<string, Position> = {};

  // Letters A-Z in circle
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const letterRadius = 200;
  const startAngle = -Math.PI / 2;
  letters.forEach((letter, index) => {
    const angle = startAngle + (2 * Math.PI * index) / letters.length;
    const x = CENTER_X + letterRadius * Math.cos(angle);
    const y = CENTER_Y + letterRadius * Math.sin(angle);
    positions[letter] = {
      x: (x / VIEWBOX_W) * 100,
      y: (y / VIEWBOX_H) * 100,
    };
  });

  // Numbers 0-9 in inner circle
  const numbers = "1234567890".split("");
  const numRadius = 130;
  numbers.forEach((num, index) => {
    const angle = startAngle + (2 * Math.PI * index) / numbers.length;
    const x = CENTER_X + numRadius * Math.cos(angle);
    const y = CENTER_Y + numRadius * Math.sin(angle);
    positions[num] = {
      x: (x / VIEWBOX_W) * 100,
      y: (y / VIEWBOX_H) * 100,
    };
  });

  // Controls
  positions["YES"] = {
    x: ((CENTER_X - 120) / VIEWBOX_W) * 100,
    y: (CENTER_Y / VIEWBOX_H) * 100,
  };
  positions["NO"] = {
    x: ((CENTER_X + 120) / VIEWBOX_W) * 100,
    y: (CENTER_Y / VIEWBOX_H) * 100,
  };
  positions["GOODBYE"] = {
    x: (CENTER_X / VIEWBOX_W) * 100,
    y: ((CENTER_Y + 50) / VIEWBOX_H) * 100,
  };
  positions["START"] = {
    x: (CENTER_X / VIEWBOX_W) * 100,
    y: (CENTER_Y / VIEWBOX_H) * 100,
  };

  return positions;
}

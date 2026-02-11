'use client';

import { motion } from 'framer-motion';
import { Position } from '@/types/ouija';

interface PlanchetteProps {
  position: Position;
  rotation: number;
  isMoving: boolean;
}

// SVG viewBox dimensions matching BoardElements
const VIEWBOX_W = 800;
const VIEWBOX_H = 600;

export function Planchette({ position, rotation, isMoving }: PlanchetteProps) {
  // Convert SVG viewBox coordinates to percentages so the planchette
  // aligns with the board regardless of container size
  const leftPercent = (position.x / VIEWBOX_W) * 100;
  const topPercent = (position.y / VIEWBOX_H) * 100;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: '10%',
        aspectRatio: '1',
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        rotate: rotation,
      }}
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 20,
        mass: 1,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 80 80"
        className={isMoving ? 'animate-pulse' : ''}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="planchetteGradient">
            <stop offset="0%" style={{ stopColor: '#8b4513', stopOpacity: 0.9 }} />
            <stop offset="100%" style={{ stopColor: '#5a2d0c', stopOpacity: 0.9 }} />
          </radialGradient>
        </defs>

        {/* Planchette body (teardrop shape) */}
        <path
          d="M 40 10
             Q 58 10 63 30
             Q 68 50 40 72
             Q 12 50 17 30
             Q 22 10 40 10 Z"
          fill="url(#planchetteGradient)"
          stroke="#d4a574"
          strokeWidth="2"
          filter={isMoving ? 'url(#glow)' : 'none'}
        />

        {/* Viewing window */}
        <circle
          cx="40"
          cy="35"
          r="14"
          fill="rgba(0, 0, 0, 0.8)"
          stroke="#d4a574"
          strokeWidth="2"
        />

        {/* Inner ring */}
        <circle
          cx="40"
          cy="35"
          r="9"
          fill="rgba(0, 0, 0, 0.9)"
          stroke="#d4a574"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Center dot */}
        <circle cx="40" cy="35" r="3" fill="#d4a574" opacity="0.4" />

        {/* Glow rings when moving */}
        {isMoving && (
          <>
            <circle cx="40" cy="35" r="17" fill="none" stroke="#d4a574" strokeWidth="1" opacity="0.3" />
            <circle cx="40" cy="35" r="21" fill="none" stroke="#d4a574" strokeWidth="1" opacity="0.15" />
          </>
        )}
      </svg>
    </motion.div>
  );
}

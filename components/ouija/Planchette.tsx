'use client';

import { motion } from 'framer-motion';
import { Position } from '@/types/ouija';

interface CoinProps {
  position: Position;
  rotation: number;
  isMoving: boolean;
}

// SVG viewBox dimensions matching BoardElements
const VIEWBOX_W = 800;
const VIEWBOX_H = 600;

export function Planchette({ position, rotation, isMoving }: CoinProps) {
  // Convert SVG viewBox coordinates to percentages
  const leftPercent = (position.x / VIEWBOX_W) * 100;
  const topPercent = (position.y / VIEWBOX_H) * 100;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: '8%',
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
        stiffness: 100,
        damping: 18,
        mass: 0.8,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 80 80"
      >
        <defs>
          <filter id="coinGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="coinFace" cx="40%" cy="35%">
            <stop offset="0%" style={{ stopColor: '#f0d060', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#c9a030', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#8a6e1e', stopOpacity: 1 }} />
          </radialGradient>
          <radialGradient id="coinEdge" cx="50%" cy="50%">
            <stop offset="85%" style={{ stopColor: 'transparent', stopOpacity: 0 }} />
            <stop offset="100%" style={{ stopColor: '#5a4010', stopOpacity: 0.6 }} />
          </radialGradient>
        </defs>

        {/* Coin shadow */}
        <ellipse
          cx="42"
          cy="44"
          rx="30"
          ry="30"
          fill="rgba(0,0,0,0.4)"
        />

        {/* Coin body */}
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="url(#coinFace)"
          stroke="#a08020"
          strokeWidth="2.5"
          filter={isMoving ? 'url(#coinGlow)' : 'none'}
        />

        {/* Edge shading */}
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="url(#coinEdge)"
        />

        {/* Inner ring */}
        <circle
          cx="40"
          cy="40"
          r="24"
          fill="none"
          stroke="#a08020"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Center viewing hole */}
        <circle
          cx="40"
          cy="40"
          r="10"
          fill="rgba(0,0,0,0.85)"
          stroke="#c9a030"
          strokeWidth="1.5"
        />

        {/* Inner hole ring */}
        <circle
          cx="40"
          cy="40"
          r="7"
          fill="rgba(0,0,0,0.95)"
          stroke="#a08020"
          strokeWidth="0.8"
          opacity="0.5"
        />

        {/* Highlight gleam */}
        <ellipse
          cx="33"
          cy="33"
          rx="8"
          ry="5"
          fill="rgba(255,255,220,0.25)"
          transform="rotate(-30, 33, 33)"
        />

        {/* Moving glow */}
        {isMoving && (
          <>
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#f0d060"
              strokeWidth="1"
              opacity="0.4"
            />
            <circle
              cx="40"
              cy="40"
              r="38"
              fill="none"
              stroke="#f0d060"
              strokeWidth="0.8"
              opacity="0.2"
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}

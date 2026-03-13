"use client";

import { motion } from "framer-motion";
import { Position } from "@/types/ouija";

interface CoinProps {
  position: Position;
  rotation: number;
  isMoving: boolean;
}

export function Planchette({ position, rotation, isMoving }: CoinProps) {
  // Position is already in viewport percentages (0-100) from calibration
  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{
        width: "12vmin",
        aspectRatio: "1",
        translateX: "-50%",
        translateY: "-50%",
        zIndex: 50,
      }}
      animate={{
        left: `${position.x}vw`,
        top: `${position.y}vh`,
        rotate: rotation,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 18,
        mass: 0.8,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 80 80">
        <defs>
          {/* Sinister blood-red glow filter */}
          <filter id="coinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feFlood floodColor="#8b0000" floodOpacity="0.6" result="redOverlay" />
            <feComposite in="redOverlay" in2="coloredBlur" operator="in" result="redGlow" />
            <feMerge>
              <feMergeNode in="redGlow" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Eerie eye glow */}
          <filter id="eyeGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* White coin face gradient */}
          <radialGradient id="coinFace" cx="40%" cy="35%">
            <stop offset="0%" style={{ stopColor: "#ffffff", stopOpacity: 1 }} />
            <stop offset="45%" style={{ stopColor: "#f3f3f3", stopOpacity: 1 }} />
            <stop offset="80%" style={{ stopColor: "#e7e7e7", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#d9d9d9", stopOpacity: 1 }} />
          </radialGradient>

          {/* Soft texture overlays */}
          <radialGradient id="corrosion1" cx="30%" cy="25%">
            <stop offset="0%" style={{ stopColor: "#f6f6f6", stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: "transparent", stopOpacity: 0 }} />
          </radialGradient>
          <radialGradient id="corrosion2" cx="70%" cy="65%">
            <stop offset="0%" style={{ stopColor: "#efefef", stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: "transparent", stopOpacity: 0 }} />
          </radialGradient>

          {/* Soft edge shading */}
          <radialGradient id="coinEdge" cx="50%" cy="50%">
            <stop offset="80%" style={{ stopColor: "transparent", stopOpacity: 0 }} />
            <stop offset="100%" style={{ stopColor: "#8a8a8a", stopOpacity: 0.35 }} />
          </radialGradient>

          {/* Blood-red pulse for the eye */}
          <radialGradient id="eyePulse" cx="50%" cy="50%">
            <stop offset="0%" style={{ stopColor: "#ff1a1a", stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: "#cc0000", stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: "#330000", stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* Dark ominous shadow */}
        <ellipse cx="42" cy="45" rx="32" ry="32" fill="rgba(0,0,0,0.5)" />

        {/* Coin body */}
        <circle
          cx="40"
          cy="40"
          r="30"
          fill="url(#coinFace)"
          stroke="#cfcfcf"
          strokeWidth="2.5"
          filter={isMoving ? "url(#coinGlow)" : "none"}
        />

        {/* Corrosion patches */}
        <circle cx="40" cy="40" r="30" fill="url(#corrosion1)" />
        <circle cx="40" cy="40" r="30" fill="url(#corrosion2)" />

        {/* Edge darkness */}
        <circle cx="40" cy="40" r="30" fill="url(#coinEdge)" />

        {/* Outer cursed ring — scratched and worn */}
        <circle
          cx="40" cy="40" r="28"
          fill="none"
          stroke="#3a3020"
          strokeWidth="0.8"
          strokeDasharray="2 1.5"
          opacity="0.7"
        />

        {/* Occult rune symbols around the rim */}
        {["☽", "✦", "☠", "✧", "☾", "⛧", "✦", "☠", "✧", "⛧", "☽", "✦"].map((rune, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = 40 + 24 * Math.cos(angle);
          const y = 40 + 24 * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#5a2020"
              fontSize="3.5"
              opacity="0.7"
            >
              {rune}
            </text>
          );
        })}

        {/* Inner boundary ring */}
        <circle
          cx="40" cy="40" r="19"
          fill="none"
          stroke="#3a2a1a"
          strokeWidth="0.6"
          opacity="0.6"
        />

        {/* ₹5 denomination — etched and worn */}
        <text
          x="40"
          y="33"
          textAnchor="middle"
          dominantBaseline="central"
          fill="#6a5a3a"
          fontSize="10"
          fontWeight="bold"
          fontFamily="serif"
          opacity="0.6"
        >
          ₹5
        </text>

        {/* Creepy all-seeing eye */}
        <g filter="url(#eyeGlow)">
          {/* Eye white (bloodshot tint) */}
          <ellipse
            cx="40" cy="44"
            rx="8" ry="5"
            fill="#1a0808"
            stroke="#4a1010"
            strokeWidth="0.5"
          />
          {/* Iris — deep crimson */}
          <circle
            cx="40" cy="44"
            r="3.5"
            fill="#660000"
            stroke="#880000"
            strokeWidth="0.3"
          />
          {/* Pupil — void black with red center glow */}
          <circle cx="40" cy="44" r="1.8" fill="#000000" />
          <circle cx="40" cy="44" r="0.6" fill="#ff0000" opacity="0.9" />

          {/* Eye glow aura */}
          <ellipse
            cx="40" cy="44"
            rx="10" ry="6.5"
            fill="url(#eyePulse)"
            opacity={isMoving ? "0.5" : "0.2"}
          />

          {/* Bloodshot veins */}
          <line x1="33" y1="43" x2="36" y2="44" stroke="#8b0000" strokeWidth="0.3" opacity="0.5" />
          <line x1="33" y1="45" x2="36" y2="44.5" stroke="#8b0000" strokeWidth="0.2" opacity="0.4" />
          <line x1="47" y1="43" x2="44" y2="44" stroke="#8b0000" strokeWidth="0.3" opacity="0.5" />
          <line x1="47" y1="45" x2="44" y2="44.5" stroke="#8b0000" strokeWidth="0.2" opacity="0.4" />
        </g>

        {/* Tiny skull below denomination */}
        <g transform="translate(40, 54)" fill="#4a3a2a" opacity="0.5">
          {/* Skull */}
          <ellipse cx="0" cy="0" rx="2.5" ry="2" />
          <rect x="-1.5" y="1.5" width="3" height="1.5" rx="0.3" />
          {/* Eye sockets */}
          <circle cx="-0.8" cy="-0.3" r="0.5" fill="#1a1a10" />
          <circle cx="0.8" cy="-0.3" r="0.5" fill="#1a1a10" />
        </g>

        {/* Scratch marks across the surface */}
        <line x1="22" y1="35" x2="28" y2="37" stroke="#2a2a1a" strokeWidth="0.3" opacity="0.3" />
        <line x1="52" y1="30" x2="58" y2="33" stroke="#2a2a1a" strokeWidth="0.3" opacity="0.25" />
        <line x1="25" y1="50" x2="30" y2="48" stroke="#2a2a1a" strokeWidth="0.2" opacity="0.3" />

        {/* Eerie dim gleam */}
        <ellipse
          cx="33" cy="33"
          rx="6" ry="3"
          fill="rgba(100,80,50,0.1)"
          transform="rotate(-30, 33, 33)"
        />

        {/* Serrated edge marks — jagged and uneven */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const jitter = i % 3 === 0 ? 1.5 : 1;
          const x1 = 40 + 29 * Math.cos(angle);
          const y1 = 40 + 29 * Math.sin(angle);
          const x2 = 40 + (30 + jitter) * Math.cos(angle);
          const y2 = 40 + (30 + jitter) * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke="#2a2a1a"
              strokeWidth={i % 3 === 0 ? "1" : "0.6"}
              opacity="0.5"
            />
          );
        })}

        {/* Moving glow rings — blood-red sinister aura */}
        {isMoving && (
          <>
            <circle
              cx="40" cy="40" r="33"
              fill="none"
              stroke="#8b0000"
              strokeWidth="2"
              opacity="0.4"
            />
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="#660000"
              strokeWidth="1.5"
              opacity="0.3"
            />
            <circle
              cx="40" cy="40" r="39"
              fill="none"
              stroke="#440000"
              strokeWidth="1"
              opacity="0.2"
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}

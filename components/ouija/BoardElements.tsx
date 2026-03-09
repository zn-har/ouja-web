"use client";

import {
  getLetterPositions,
  getNumberPositions,
  getControlPositions,
} from "@/utils/boardPositions";

export function BoardElements() {
  const letters = getLetterPositions();
  const numbers = getNumberPositions();
  const controls = getControlPositions();

  return (
    <svg viewBox="0 0 800 600" className="w-full h-full">
      <defs>
        {/* Wood grain gradient */}
        <radialGradient id="boardGradient" cx="50%" cy="50%" r="70%">
          <stop offset="0%" style={{ stopColor: "#3d2213", stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: "#2a1810", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#150c07", stopOpacity: 1 }}
          />
        </radialGradient>

        {/* Wood grain pattern */}
        <pattern
          id="woodGrain"
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          <rect width="200" height="200" fill="transparent" />
          <line
            x1="0"
            y1="20"
            x2="200"
            y2="25"
            stroke="#3d2213"
            strokeWidth="0.5"
            opacity="0.15"
          />
          <line
            x1="0"
            y1="50"
            x2="200"
            y2="48"
            stroke="#3d2213"
            strokeWidth="0.8"
            opacity="0.1"
          />
          <line
            x1="0"
            y1="85"
            x2="200"
            y2="88"
            stroke="#3d2213"
            strokeWidth="0.4"
            opacity="0.12"
          />
          <line
            x1="0"
            y1="110"
            x2="200"
            y2="112"
            stroke="#3d2213"
            strokeWidth="0.6"
            opacity="0.08"
          />
          <line
            x1="0"
            y1="145"
            x2="200"
            y2="142"
            stroke="#3d2213"
            strokeWidth="0.5"
            opacity="0.1"
          />
          <line
            x1="0"
            y1="175"
            x2="200"
            y2="178"
            stroke="#3d2213"
            strokeWidth="0.3"
            opacity="0.13"
          />
        </pattern>

        {/* Letter glow filter */}
        <filter id="letterGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Soft glow for decorative elements */}
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ornate corner clip */}
        <linearGradient id="borderGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#c9a030", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#8b6914", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#c9a030", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      {/* Board background */}
      <rect
        x="40"
        y="20"
        width="720"
        height="560"
        rx="25"
        fill="url(#boardGradient)"
        stroke="url(#borderGold)"
        strokeWidth="3"
      />

      {/* Wood grain overlay */}
      <rect
        x="40"
        y="20"
        width="720"
        height="560"
        rx="25"
        fill="url(#woodGrain)"
        opacity="0.6"
      />

      {/* Inner border */}
      <rect
        x="55"
        y="35"
        width="690"
        height="530"
        rx="18"
        fill="none"
        stroke="#d4a574"
        strokeWidth="0.8"
        opacity="0.3"
        strokeDasharray="4 6"
      />

      {/* Outer decorative ring */}
      <circle
        cx="400"
        cy="300"
        r="228"
        fill="none"
        stroke="#d4a574"
        strokeWidth="0.5"
        opacity="0.15"
        strokeDasharray="2 4"
      />
      <circle
        cx="400"
        cy="300"
        r="222"
        fill="none"
        stroke="#8b6914"
        strokeWidth="0.8"
        opacity="0.12"
      />

      {/* Inner decorative ring */}
      <circle
        cx="400"
        cy="300"
        r="152"
        fill="none"
        stroke="#d4a574"
        strokeWidth="0.5"
        opacity="0.12"
        strokeDasharray="2 4"
      />
      <circle
        cx="400"
        cy="300"
        r="148"
        fill="none"
        stroke="#8b6914"
        strokeWidth="0.8"
        opacity="0.1"
      />

      {/* Center circle */}
      <circle
        cx="400"
        cy="300"
        r="70"
        fill="none"
        stroke="#d4a574"
        strokeWidth="0.5"
        opacity="0.08"
      />

      {/* Cross lines through center */}
      <line
        x1="400"
        y1="235"
        x2="400"
        y2="365"
        stroke="#d4a574"
        strokeWidth="0.3"
        opacity="0.06"
      />
      <line
        x1="335"
        y1="300"
        x2="465"
        y2="300"
        stroke="#d4a574"
        strokeWidth="0.3"
        opacity="0.06"
      />

      {/* Sun (top-left) */}
      <g opacity="0.5" filter="url(#softGlow)">
        <circle
          cx="110"
          cy="60"
          r="12"
          fill="none"
          stroke="#d4a574"
          strokeWidth="1.5"
        />
        <circle cx="110" cy="60" r="6" fill="#d4a574" opacity="0.6" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={110 + 15 * Math.cos(rad)}
              y1={60 + 15 * Math.sin(rad)}
              x2={110 + 20 * Math.cos(rad)}
              y2={60 + 20 * Math.sin(rad)}
              stroke="#d4a574"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}
      </g>

      {/* Moon (top-right) */}
      <g opacity="0.5" filter="url(#softGlow)">
        <path
          d="M 690 48 A 14 14 0 1 0 690 72 A 10 10 0 1 1 690 48"
          fill="#d4a574"
          opacity="0.6"
        />
      </g>

      {/* Decorative stars */}
      {[
        { x: 80, y: 545, size: 8 },
        { x: 720, y: 545, size: 8 },
        { x: 400, y: 40, size: 6 },
        { x: 160, y: 45, size: 5 },
        { x: 640, y: 45, size: 5 },
      ].map((star, i) => (
        <g key={i} opacity="0.35" filter="url(#softGlow)">
          <path
            d={`M ${star.x} ${star.y - star.size}
                L ${star.x + star.size * 0.3} ${star.y - star.size * 0.3}
                L ${star.x + star.size} ${star.y}
                L ${star.x + star.size * 0.3} ${star.y + star.size * 0.3}
                L ${star.x} ${star.y + star.size}
                L ${star.x - star.size * 0.3} ${star.y + star.size * 0.3}
                L ${star.x - star.size} ${star.y}
                L ${star.x - star.size * 0.3} ${star.y - star.size * 0.3} Z`}
            fill="#d4a574"
          />
        </g>
      ))}

      {/* Corner ornaments */}
      {[
        { x: 65, y: 50, scaleX: 1, scaleY: 1 },
        { x: 735, y: 50, scaleX: -1, scaleY: 1 },
        { x: 65, y: 550, scaleX: 1, scaleY: -1 },
        { x: 735, y: 550, scaleX: -1, scaleY: -1 },
      ].map((corner, i) => (
        <g
          key={i}
          transform={`translate(${corner.x}, ${corner.y}) scale(${corner.scaleX}, ${corner.scaleY})`}
          opacity="0.3"
        >
          <path
            d="M 0 0 Q 20 0 20 5 Q 18 8 10 8 Q 5 8 5 15 Q 5 20 0 20"
            fill="none"
            stroke="#d4a574"
            strokeWidth="1.2"
          />
        </g>
      ))}

      {/* Letters A-Z */}
      {letters.map((letter) => (
        <g key={letter.char} className="board-letter">
          <text
            x={letter.position.x}
            y={letter.position.y}
            fontSize="24"
            fontWeight="bold"
            fill="#d4a574"
            textAnchor="middle"
            dominantBaseline="middle"
            filter="url(#letterGlow)"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {letter.char}
          </text>
        </g>
      ))}

      {/* Numbers 0-9 */}
      {numbers.map((number) => (
        <g key={number.char} className="board-letter">
          <text
            x={number.position.x}
            y={number.position.y}
            fontSize="20"
            fontWeight="bold"
            fill="#a0785a"
            textAnchor="middle"
            dominantBaseline="middle"
            filter="url(#letterGlow)"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {number.char}
          </text>
        </g>
      ))}

      {/* YES */}
      <g filter="url(#softGlow)">
        <text
          x={controls.yes.x}
          y={controls.yes.y}
          fontSize="22"
          fontWeight="bold"
          fill="#d4a574"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontFamily: "'Cinzel', serif", letterSpacing: "3px" }}
        >
          YES
        </text>
      </g>

      {/* NO */}
      <g filter="url(#softGlow)">
        <text
          x={controls.no.x}
          y={controls.no.y}
          fontSize="22"
          fontWeight="bold"
          fill="#d4a574"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontFamily: "'Cinzel', serif", letterSpacing: "3px" }}
        >
          NO
        </text>
      </g>

      {/* GOODBYE */}
      <g filter="url(#softGlow)">
        <text
          x={controls.goodbye.x}
          y={controls.goodbye.y}
          fontSize="18"
          fontWeight="bold"
          fill="#d4a574"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontFamily: "'Cinzel', serif", letterSpacing: "4px" }}
        >
          GOODBYE
        </text>
      </g>

      {/* Bottom decorative line */}
      <line
        x1="250"
        y1="560"
        x2="550"
        y2="560"
        stroke="#d4a574"
        strokeWidth="0.5"
        opacity="0.2"
      />
    </svg>
  );
}

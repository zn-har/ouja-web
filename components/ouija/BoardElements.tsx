'use client';

import { getLetterPositions, getNumberPositions, getControlPositions } from '@/utils/boardPositions';

export function BoardElements() {
  const letters = getLetterPositions();
  const numbers = getNumberPositions();
  const controls = getControlPositions();

  return (
    <svg
      viewBox="0 0 800 600"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 0 20px rgba(139, 69, 19, 0.5))' }}
    >
      {/* Background */}
      <defs>
        <radialGradient id="boardGradient" cx="50%" cy="50%">
          <stop offset="0%" style={{ stopColor: '#2a1810', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1a0f0a', stopOpacity: 1 }} />
        </radialGradient>
      </defs>

      {/* Board background */}
      <rect
        x="50"
        y="30"
        width="700"
        height="540"
        rx="20"
        fill="url(#boardGradient)"
        stroke="#8b4513"
        strokeWidth="3"
      />

      {/* Outer decorative circle (letter ring guide) */}
      <circle
        cx="400"
        cy="300"
        r="220"
        fill="none"
        stroke="#d4a574"
        strokeWidth="1"
        opacity="0.2"
      />

      {/* Inner decorative circle (number ring guide) */}
      <circle
        cx="400"
        cy="300"
        r="150"
        fill="none"
        stroke="#d4a574"
        strokeWidth="1"
        opacity="0.15"
      />

      {/* Center decorative circle */}
      <circle
        cx="400"
        cy="300"
        r="80"
        fill="none"
        stroke="#d4a574"
        strokeWidth="1"
        opacity="0.1"
      />

      {/* Letters (A-Z full circle) */}
      {letters.map((letter) => (
        <g key={letter.char}>
          <text
            x={letter.position.x}
            y={letter.position.y}
            fontSize="24"
            fontWeight="bold"
            fill="#d4a574"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: 'serif' }}
          >
            {letter.char}
          </text>
        </g>
      ))}

      {/* Numbers (0-9 inner circle) */}
      {numbers.map((number) => (
        <g key={number.char}>
          <text
            x={number.position.x}
            y={number.position.y}
            fontSize="20"
            fontWeight="bold"
            fill="#a0785a"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: 'serif' }}
          >
            {number.char}
          </text>
        </g>
      ))}

      {/* YES (center left) */}
      <g>
        <text
          x={controls.yes.x}
          y={controls.yes.y}
          fontSize="22"
          fontWeight="bold"
          fill="#d4a574"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: 'serif',
            letterSpacing: '2px'
          }}
        >
          YES
        </text>
      </g>

      {/* NO (center right) */}
      <g>
        <text
          x={controls.no.x}
          y={controls.no.y}
          fontSize="22"
          fontWeight="bold"
          fill="#d4a574"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: 'serif',
            letterSpacing: '2px'
          }}
        >
          NO
        </text>
      </g>

      {/* GOODBYE (center bottom) */}
      <g>
        <text
          x={controls.goodbye.x}
          y={controls.goodbye.y}
          fontSize="18"
          fontWeight="bold"
          fill="#d4a574"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: 'serif',
            letterSpacing: '3px'
          }}
        >
          GOODBYE
        </text>
      </g>

      {/* Decorative corner elements */}
      <text x="80" y="55" fontSize="18" fill="#d4a574" opacity="0.5" textAnchor="middle">&#9788;</text>
      <text x="720" y="55" fontSize="18" fill="#d4a574" opacity="0.5" textAnchor="middle">&#9789;</text>
      <text x="80" y="555" fontSize="16" fill="#d4a574" opacity="0.4" textAnchor="middle">&#10022;</text>
      <text x="720" y="555" fontSize="16" fill="#d4a574" opacity="0.4" textAnchor="middle">&#10022;</text>
    </svg>
  );
}

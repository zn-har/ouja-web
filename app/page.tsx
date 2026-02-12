'use client';

import { useState, useEffect } from 'react';
import { usePlanchette } from '@/hooks/usePlanchette';
import { useOuijaSession } from '@/hooks/useOuijaSession';
import { BoardElements } from '@/components/ouija/BoardElements';
import { Planchette } from '@/components/ouija/Planchette';
import { QuestionInput } from '@/components/ouija/QuestionInput';
import { MessageHistory } from '@/components/ouija/MessageHistory';

interface Particle {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 15,
        duration: Math.random() * 10 + 12,
        opacity: Math.random() * 0.4 + 0.1,
      }))
    );
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-particle"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: '#d4a574',
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const planchette = usePlanchette();

  const session = useOuijaSession({
    onCharacterChange: planchette.animateToCharacter,
    onComplete: planchette.reset
  });

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-950 via-[#0d0907] to-black py-8 px-4">
      {/* Ambient particles */}
      <FloatingParticles />

      {/* Radial ambient glow behind board */}
      <div
        className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-5xl md:text-7xl font-bold mb-3 text-shimmer"
            style={{
              fontFamily: "'Cinzel', serif",
              letterSpacing: '8px',
            }}
          >
            OUIJA
          </h1>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-700" />
            <span className="text-amber-700 text-xs tracking-[6px] uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
              Spirit Board
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-700" />
          </div>
          <p className="text-amber-800/60 text-sm" style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic' }}>
            Ask the spirits your questions... if you dare
          </p>
        </div>

        {/* Ouija Board */}
        <div className="relative w-full max-w-4xl mx-auto mb-8 animate-drift">
          <div
            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden animate-board-breathe"
            style={{ background: '#0e0906' }}
          >
            {/* Board Elements */}
            <BoardElements />

            {/* Vignette overlay */}
            <div className="absolute inset-0 board-vignette" />

            {/* Coin */}
            <Planchette
              position={planchette.position}
              rotation={planchette.rotation}
              isMoving={planchette.isMoving}
            />
          </div>

          {/* Current Answer Display */}
          {session.currentAnswer && (
            <div className="mt-6 text-center">
              <p className="text-amber-600/50 text-xs tracking-[4px] uppercase mb-2"
                style={{ fontFamily: "'Cinzel', serif" }}>
                The spirit speaks
              </p>
              <p
                className="text-amber-200 text-3xl font-bold tracking-[8px] text-shimmer"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {session.currentAnswer}
              </p>
            </div>
          )}
        </div>

        {/* Question Input */}
        <QuestionInput
          onSubmit={session.askSpirit}
          disabled={session.isAsking}
        />

        {/* Error Display */}
        {session.error && (
          <div className="mt-4 p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-center max-w-2xl mx-auto">
            <p className="text-red-400/80 text-sm" style={{ fontFamily: "'EB Garamond', serif" }}>
              {session.error}
            </p>
          </div>
        )}

        {/* Message History */}
        <MessageHistory
          messages={session.messages}
          onClear={session.clearHistory}
        />

        {/* Footer */}
        <div className="text-center mt-16 mb-8">
          <div className="flex items-center justify-center gap-3 text-amber-900/40 text-xs">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-900/30" />
            <span style={{ fontFamily: "'Cinzel', serif", letterSpacing: '3px' }}>
              May the spirits guide you
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-900/30" />
          </div>
        </div>
      </div>
    </main>
  );
}

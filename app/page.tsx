'use client';

import { usePlanchette } from '@/hooks/usePlanchette';
import { useOuijaSession } from '@/hooks/useOuijaSession';
import { BoardElements } from '@/components/ouija/BoardElements';
import { Planchette } from '@/components/ouija/Planchette';
import { QuestionInput } from '@/components/ouija/QuestionInput';
import { MessageHistory } from '@/components/ouija/MessageHistory';

export default function Home() {
  const planchette = usePlanchette();

  const session = useOuijaSession({
    onCharacterChange: planchette.animateToCharacter,
    onComplete: planchette.reset
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-5xl md:text-6xl font-bold text-amber-600 mb-2"
            style={{
              fontFamily: 'serif',
              letterSpacing: '4px',
              textShadow: '0 0 30px rgba(217, 119, 6, 0.8)'
            }}
          >
            ✦ OUIJA ✦
          </h1>
          <p className="text-amber-800 text-sm md:text-base" style={{ fontFamily: 'serif' }}>
            Ask the spirits your questions... if you dare
          </p>
        </div>

        {/* Ouija Board */}
        <div className="relative w-full max-w-4xl mx-auto mb-8">
          <div
            className="relative w-full aspect-[4/3] bg-gray-900 rounded-lg shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 0 50px rgba(217, 119, 6, 0.3)'
            }}
          >
            {/* Board Elements */}
            <BoardElements />

            {/* Planchette */}
            <Planchette
              position={planchette.position}
              rotation={planchette.rotation}
              isMoving={planchette.isMoving}
            />
          </div>

          {/* Current Answer Display */}
          {session.currentAnswer && (
            <div className="mt-4 text-center">
              <p className="text-amber-500 text-sm mb-1">Current Message:</p>
              <p
                className="text-amber-300 text-2xl font-bold tracking-widest"
                style={{
                  fontFamily: 'serif',
                  textShadow: '0 0 15px rgba(252, 211, 77, 0.5)'
                }}
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
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-center">
            <p className="text-red-400">{session.error}</p>
          </div>
        )}

        {/* Message History */}
        <MessageHistory
          messages={session.messages}
          onClear={session.clearHistory}
        />

        {/* Footer */}
        <div className="text-center mt-12 text-amber-900 text-xs" style={{ fontFamily: 'serif' }}>
          <p className="mt-2">✦ May the spirits guide you ✦</p>
        </div>
      </div>
    </main>
  );
}

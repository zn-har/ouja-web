'use client';

import { useState } from 'react';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled: boolean;
}

export function QuestionInput({ onSubmit, disabled }: QuestionInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !disabled) {
      onSubmit(question);
      setQuestion('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-8">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={disabled}
            placeholder="Ask the spirits a question..."
            maxLength={100}
            className="w-full px-6 py-4 bg-gray-900 border-2 border-amber-700 rounded-lg
                     text-amber-100 placeholder-amber-900 text-lg
                     focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
            style={{
              fontFamily: 'serif',
              textShadow: disabled ? 'none' : '0 0 10px rgba(217, 119, 6, 0.3)'
            }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-700 text-sm">
            {question.length}/100
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled || !question.trim()}
          className="px-8 py-4 bg-gradient-to-br from-amber-900 to-amber-950
                   text-amber-100 font-bold text-lg rounded-lg
                   border-2 border-amber-700
                   hover:from-amber-800 hover:to-amber-900 hover:border-amber-600
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300
                   hover:shadow-[0_0_20px_rgba(217,119,6,0.5)]
                   active:scale-95"
          style={{
            fontFamily: 'serif',
            letterSpacing: '2px',
            textShadow: '0 0 10px rgba(0, 0, 0, 0.5)'
          }}
        >
          {disabled ? '✨ SPIRITS ARE SPEAKING ✨' : '🔮 ASK THE SPIRITS 🔮'}
        </button>

        {disabled && (
          <p className="text-center text-amber-600 text-sm animate-pulse">
            The planchette is moving... watch carefully...
          </p>
        )}
      </div>
    </form>
  );
}

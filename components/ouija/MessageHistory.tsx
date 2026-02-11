'use client';

import { Message } from '@/types/ouija';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageHistoryProps {
  messages: Message[];
  onClear: () => void;
}

export function MessageHistory({ messages, onClear }: MessageHistoryProps) {
  if (messages.length === 0) {
    return null;
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-2xl font-bold text-amber-600"
          style={{
            fontFamily: 'serif',
            letterSpacing: '2px',
            textShadow: '0 0 10px rgba(217, 119, 6, 0.5)'
          }}
        >
          ✦ SPIRIT MESSAGES ✦
        </h2>
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm text-amber-700 border border-amber-700 rounded
                   hover:bg-amber-900 hover:text-amber-100 transition-all duration-300"
          style={{ fontFamily: 'serif' }}
        >
          Clear History
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-gray-900">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.timestamp}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900 border-2 border-amber-800 rounded-lg p-4
                       hover:border-amber-600 transition-all duration-300"
              style={{
                boxShadow: '0 0 15px rgba(217, 119, 6, 0.1)'
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  {/* Question */}
                  <div>
                    <div className="text-xs text-amber-700 mb-1 font-semibold">
                      YOUR QUESTION:
                    </div>
                    <div
                      className="text-amber-100 text-base"
                      style={{ fontFamily: 'serif' }}
                    >
                      {message.question}
                    </div>
                  </div>

                  {/* Answer */}
                  <div>
                    <div className="text-xs text-amber-700 mb-1 font-semibold">
                      SPIRIT ANSWER:
                    </div>
                    <div
                      className="text-amber-300 text-xl font-bold tracking-wider"
                      style={{
                        fontFamily: 'serif',
                        textShadow: '0 0 10px rgba(252, 211, 77, 0.3)'
                      }}
                    >
                      {message.answer}
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-amber-800 whitespace-nowrap">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

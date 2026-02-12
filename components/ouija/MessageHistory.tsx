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
    <div className="w-full max-w-2xl mx-auto mt-16 mb-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-700/40" />
          <h2
            className="text-lg font-semibold text-amber-600/70 tracking-[4px] uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Messages
          </h2>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-700/40" />
        </div>
        <button
          onClick={onClear}
          className="px-3 py-1.5 text-xs text-amber-800/50 border border-amber-800/20 rounded-lg
                   hover:bg-amber-900/10 hover:text-amber-600/70 hover:border-amber-800/40
                   transition-all duration-500"
          style={{ fontFamily: "'Cinzel', serif", letterSpacing: '1px' }}
        >
          Clear
        </button>
      </div>

      {/* Messages list */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.timestamp}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-[#0e0906] border border-amber-800/20 rounded-xl p-5
                       hover:border-amber-700/30 transition-all duration-500
                       group"
              style={{
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Question */}
                  <div>
                    <div className="text-[10px] text-amber-700/40 mb-1 tracking-[3px] uppercase"
                      style={{ fontFamily: "'Cinzel', serif" }}>
                      Question
                    </div>
                    <div
                      className="text-amber-100/70 text-base"
                      style={{ fontFamily: "'EB Garamond', serif" }}
                    >
                      {message.question}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-amber-800/10 via-amber-800/20 to-amber-800/10" />

                  {/* Answer */}
                  <div>
                    <div className="text-[10px] text-amber-700/40 mb-1 tracking-[3px] uppercase"
                      style={{ fontFamily: "'Cinzel', serif" }}>
                      Spirit
                    </div>
                    <div
                      className="text-amber-300/80 text-xl font-bold tracking-[4px]"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        textShadow: '0 0 12px rgba(252, 211, 77, 0.15)'
                      }}
                    >
                      {message.answer}
                    </div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-[10px] text-amber-800/30 whitespace-nowrap"
                  style={{ fontFamily: "'Cinzel', serif" }}>
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

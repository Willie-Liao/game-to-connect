import React, { useState } from 'react';
import { Heart, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScoreboardProps {
  score: { you: number; her: number };
  onReset: () => void;
  activeGameName?: string;
  onGoHome?: () => void;
}

export default function Scoreboard({ score, onReset, activeGameName, onGoHome }: ScoreboardProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <header className="w-full max-w-2xl mx-auto mb-8 antialiased">
      <div className="flex flex-col gap-4 p-5 md:p-6 bg-white rounded-xl border border-line shadow-xs">
        <div className="flex items-center justify-between">
          {/* Logo & Category indicator */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onGoHome}>
            <div className="w-7 h-7 rounded-full bg-sage/10 flex items-center justify-center border border-sage/20">
              <Heart className="w-4 h-4 text-sage fill-sage/25 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xs font-semibold tracking-widest text-[#2A2D34] font-sans uppercase">US & CLOSER</h1>
              <p className="text-[9px] font-medium text-slate uppercase tracking-wider">the connection game</p>
            </div>
          </div>

          {/* Active game header indicator */}
          {activeGameName && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg border border-line">
              <span className="w-1.5 h-1.5 rounded-full bg-sage animate-ping"></span>
              <span className="text-[10px] font-bold text-slate font-mono uppercase tracking-wider">{activeGameName}</span>
            </div>
          )}

          {/* Reset Score Action */}
          <button
            onClick={() => setShowPrompt(true)}
            className="flex items-center gap-1.5 text-[10px] text-slate hover:text-ink transition-colors font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md bg-bg hover:bg-line/40 border border-line cursor-pointer"
            title="Reset Scoreboard"
            id="reset-score-btn"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden xs:inline">Reset Scores</span>
          </button>
        </div>

        {/* Score blocks */}
        <div className="grid grid-cols-2 gap-4">
          {/* Player: You */}
          <div className="flex items-center justify-between p-3.5 px-4 bg-bg rounded-lg border border-line relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-sage/60"></div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate uppercase">Wiki</p>
              <p className="text-[11px] font-serif italic text-slate/75">Round Partner</p>
            </div>
            <div className="relative">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={score.you}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="text-2xl font-serif italic font-light text-ink block"
                >
                  {score.you}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Player: Her */}
          <div className="flex items-center justify-between p-3.5 px-4 bg-bg rounded-lg border border-line relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber/60"></div>
            <div>
              <p className="text-[10px] font-bold tracking-widest text-slate uppercase">Jelly</p>
              <p className="text-[11px] font-serif italic text-slate/75">Round Partner</p>
            </div>
            <div className="relative">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={score.her}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="text-2xl font-serif italic font-light text-ink block"
                >
                  {score.her}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/30 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-xl border border-line p-6 max-w-sm w-full shadow-lg text-center font-sans space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber/30 flex items-center justify-center mx-auto">
                <Heart className="w-5 h-5 text-amber fill-amber/10 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-serif font-normal italic text-ink">Reset scoreboard?</h3>
                <p className="text-xs text-slate mt-1 leading-relaxed">
                  This will set both points for you and her back to 0. Would you like to start a fresh closer session?
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPrompt(false)}
                  className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 border border-line text-slate text-xs font-mono uppercase tracking-wider rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                    setShowPrompt(false);
                  }}
                  className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 border border-rose-600/20 text-white text-xs font-mono uppercase tracking-wider rounded-md font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Reset Play
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

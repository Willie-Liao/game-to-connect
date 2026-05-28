import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UNSCRAMBLE_WORDS, UnscrambleWord } from '../data';

interface WordUnscrambleProps {
  onGameOver: (winner: 'you' | 'her' | 'tie', summary: string) => void;
  onGoHome: () => void;
  key?: string;
}

export default function WordUnscramble({ onGameOver, onGoHome }: WordUnscrambleProps) {
  const [currentWordItem, setCurrentWordItem] = useState<UnscrambleWord | null>(null);
  
  // Player input values
  const [youInput, setYouInput] = useState<string>('');
  const [herInput, setHerInput] = useState<string>('');
  
  // Feedbacks
  const [youError, setYouError] = useState<boolean>(false);
  const [herError, setHerError] = useState<boolean>(false);

  useEffect(() => {
    drawWord();
  }, []);

  const drawWord = () => {
    const randomIndex = Math.floor(Math.random() * UNSCRAMBLE_WORDS.length);
    setCurrentWordItem(UNSCRAMBLE_WORDS[randomIndex]);
    setYouInput('');
    setHerInput('');
    setYouError(false);
    setHerError(false);
  };

  const handleKeyboardSubmit = (player: 'you' | 'her', textVal: string) => {
    if (!currentWordItem) return;
    
    const preparedAnswer = textVal.trim().toUpperCase();
    const isCorrect = preparedAnswer === currentWordItem.word.toUpperCase();

    if (isCorrect) {
      const summaryText = `The correctly unscrambled word was "${currentWordItem.word}". ${player === 'you' ? 'You' : 'Her'} figured it out first and claimed the win!`;
      onGameOver(player, summaryText);
    } else {
      if (player === 'you') {
        setYouError(true);
        setTimeout(() => setYouError(false), 800);
      } else {
        setHerError(true);
        setTimeout(() => setHerError(false), 800);
      }
    }
  };

  if (!currentWordItem) {
    return (
      <div className="flex justify-center p-12">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-rose-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-2xl mx-auto p-5 sm:p-7 bg-white rounded-xl border border-line shadow-xs"
    >
      <div className="text-center mb-6">
        <span className="px-3 py-1 text-[10px] font-bold text-sage bg-bg border border-line rounded-full uppercase tracking-widest font-mono">
          Game 3: Word Unscramble
        </span>
        <h2 className="text-3xl font-serif text-ink mt-3 font-normal italic tracking-tight">
          Unscramble Connection
        </h2>
        <p className="text-xs sm:text-sm text-slate max-w-md mx-auto mt-2 font-sans leading-relaxed">
          Who can solve the connection-themed scrambled term first? Type your guess and press Submit or Enter!
        </p>
      </div>

      {/* Scrambled word display card */}
      <div className="bg-bg border border-line rounded-lg p-6 mb-7 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 text-slate pointer-events-none opacity-50">
          <Sparkles className="w-4 h-4 text-sage" />
        </div>
        
        <span className="text-[9px] font-bold tracking-widest text-[#4A5568]/60 uppercase block font-mono mb-1">Scrambled Word</span>
        
        {/* Scrambled letters */}
        <h3 className="text-3xl sm:text-4xl font-serif italic text-ink my-3 tracking-widest select-none">
          {currentWordItem.scrambled}
        </h3>

        {/* Hint banner */}
        <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-line rounded-full max-w-md mx-auto shadow-xs">
          <HelpCircle className="w-3.5 h-3.5 text-sage shrink-0" />
          <span className="text-xs text-slate font-medium line-clamp-2">
            Hint: {currentWordItem.hint}
          </span>
        </div>
      </div>

      {/* Inputs for You & Her */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        
        {/* You column input */}
        <motion.div 
          animate={youError ? { x: [-6, 6, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="p-4 bg-bg rounded-lg border border-line flex flex-col gap-2.5 relative"
        >
          <div className="absolute top-0 left-0 w-[3px] h-full bg-sage rounded-l-lg"></div>
          <label className="text-[10px] font-bold tracking-widest text-slate uppercase flex items-center justify-between font-mono">
            <span>YOU</span>
            {youError && <span className="text-[9px] text-amber font-semibold uppercase font-mono tracking-wider">Incorrect!</span>}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              autoComplete="off"
              value={youInput}
              onChange={(e) => setYouInput(e.target.value)}
              placeholder="Your guess..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleKeyboardSubmit('you', youInput);
              }}
              className="flex-1 bg-white border border-line rounded-md px-3 py-2 text-xs font-semibold tracking-wide uppercase focus:outline-none focus:border-sage"
            />
            <button
              onClick={() => handleKeyboardSubmit('you', youInput)}
              disabled={!youInput.trim()}
              className="p-2.5 bg-slate hover:bg-ink text-white rounded-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* Her column input */}
        <motion.div 
          animate={herError ? { x: [-6, 6, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="p-4 bg-bg rounded-lg border border-line flex flex-col gap-2.5 relative"
        >
          <div className="absolute top-0 left-0 w-[3px] h-full bg-amber rounded-l-lg"></div>
          <label className="text-[10px] font-bold tracking-widest text-slate uppercase flex items-center justify-between font-mono">
            <span>HER</span>
            {herError && <span className="text-[9px] text-amber font-semibold uppercase font-mono tracking-wider">Incorrect!</span>}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              autoComplete="off"
              value={herInput}
              onChange={(e) => setHerInput(e.target.value)}
              placeholder="Her guess..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleKeyboardSubmit('her', herInput);
              }}
              className="flex-1 bg-white border border-line rounded-md px-3 py-2 text-xs font-semibold tracking-wide uppercase focus:outline-none focus:border-sage"
            />
            <button
              onClick={() => handleKeyboardSubmit('her', herInput)}
              disabled={!herInput.trim()}
              className="p-2.5 bg-slate hover:bg-ink text-white rounded-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Control Actions */}
      <div className="flex justify-center gap-3">
        <button
          onClick={drawWord}
          className="flex items-center gap-1.5 text-[10px] text-slate hover:text-ink font-semibold uppercase tracking-wider px-4 py-3 border border-line hover:bg-bg rounded-lg transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Try Another
        </button>
        <button
          onClick={onGoHome}
          className="text-[10px] text-slate hover:text-ink font-semibold uppercase tracking-wider px-4 py-3 border border-line hover:bg-bg rounded-lg transition-all"
        >
          Exit Game
        </button>
      </div>
    </motion.div>
  );
}

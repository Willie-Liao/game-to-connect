import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface MindReaderProps {
  onGameOver: (winner: 'you' | 'her' | 'tie', summary: string) => void;
  onGoHome: () => void;
  key?: string;
}

export default function MindReader({ onGameOver, onGoHome }: MindReaderProps) {
  // Generate random target number on mount
  const [targetNumber, setTargetNumber] = useState<number>(0);
  
  // Game states for inputs
  const [youGuess, setYouGuess] = useState<string>('');
  const [herGuess, setHerGuess] = useState<string>('');
  
  const [youLocked, setYouLocked] = useState<boolean>(false);
  const [herLocked, setHerLocked] = useState<boolean>(false);
  
  const [youHide, setYouHide] = useState<boolean>(true);
  const [herHide, setHerHide] = useState<boolean>(true);

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Generate target number between 30 and 70
    const secret = Math.floor(Math.random() * 41) + 30; // 30 to 70 inclusive
    setTargetNumber(secret);
  }, []);

  const handleReset = () => {
    const secret = Math.floor(Math.random() * 41) + 30;
    setTargetNumber(secret);
    setYouGuess('');
    setHerGuess('');
    setYouLocked(false);
    setHerLocked(false);
    setYouHide(true);
    setHerHide(true);
    setErrorMessage('');
  };

  const calculateResult = () => {
    const yg = parseInt(youGuess);
    const hg = parseInt(herGuess);

    if (isNaN(yg) || yg < 0 || yg > 100) {
      setErrorMessage("You's guess must be a valid number between 0 and 100.");
      return;
    }
    if (isNaN(hg) || hg < 0 || hg > 100) {
      setErrorMessage("Her's guess must be a valid number between 0 and 100.");
      return;
    }

    const youDiff = Math.abs(yg - targetNumber);
    const herDiff = Math.abs(hg - targetNumber);

    let winner: 'you' | 'her' | 'tie';
    let summaryText = '';

    if (youDiff < herDiff) {
      winner = 'you';
      summaryText = `The target was ${targetNumber}. You guessed ${yg} (diff: ${youDiff}), while Her guessed ${hg} (diff: ${herDiff}). You were closer!`;
    } else if (herDiff < youDiff) {
      winner = 'her';
      summaryText = `The target was ${targetNumber}. Her guessed ${hg} (diff: ${herDiff}), while You guessed ${yg} (diff: ${youDiff}). She was closer!`;
    } else {
      winner = 'tie';
      summaryText = `The target was ${targetNumber}. Both of you guessed ${yg} (diff: ${youDiff})! It is an amazing double tie! Let's draw a question for both to answer or draw again!`;
    }

    onGameOver(winner, summaryText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl border border-line shadow-xs"
    >
      <div className="text-center mb-8">
        <span className="px-3 py-1 text-[10px] font-bold text-sage bg-bg border border-line rounded-full uppercase tracking-widest font-mono">
          Game 1: The Mind-Reader
        </span>
        <h2 className="text-2xl font-serif text-ink mt-3 font-normal italic tracking-tight">
          What is the Secret Number?
        </h2>
        <p className="text-xs sm:text-sm text-slate max-w-md mx-auto mt-2 font-sans leading-relaxed">
          The connection system secretly drew a whole number between <strong className="text-ink">30 and 70</strong>. 
          Guess closest to win. Hide your screen so your partner doesn't peek!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* You Player Column */}
        <div className="flex flex-col p-5 bg-bg rounded-lg border border-line relative group transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-sage rounded-t-lg"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold tracking-widest text-slate uppercase font-mono">YOU</span>
            {youLocked && (
              <span className="text-[10px] font-semibold text-sage flex items-center gap-1 font-mono uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" /> Locked
              </span>
            )}
          </div>

          <div className="space-y-4 font-sans">
            <label className="text-xs font-semibold text-slate block uppercase tracking-wider text-[10px]">Enter your guess (30 - 70):</label>
            <div className="relative">
              <input
                type={youHide && !youLocked ? 'password' : 'text'}
                pattern="[0-9]*"
                inputMode="numeric"
                disabled={youLocked}
                value={youGuess}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setYouGuess(val);
                }}
                placeholder="—"
                className="w-full bg-white border border-line rounded-lg px-4 py-3 text-ink font-mono text-center text-lg font-semibold focus:outline-none focus:border-sage transition-all disabled:opacity-75 disabled:bg-line/20"
              />
              
              {!youLocked && youGuess && (
                <button
                  type="button"
                  onClick={() => setYouHide(!youHide)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate hover:text-ink transition-colors"
                >
                  {youHide ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>

            <button
              onClick={() => {
                if (!youGuess) return;
                setYouLocked(true);
                setErrorMessage('');
              }}
              disabled={youLocked || !youGuess}
              className={`w-full py-2.5 rounded-lg font-semibold text-[10px] transition-all tracking-wider uppercase flex items-center justify-center gap-2 ${
                youLocked
                  ? 'bg-line/20 text-slate border border-line'
                  : 'bg-slate hover:bg-ink text-white cursor-pointer active:scale-98'
              }`}
            >
              Lock Guess
            </button>
          </div>
        </div>

        {/* Her Player Column */}
        <div className="flex flex-col p-5 bg-bg rounded-lg border border-line relative group transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-amber rounded-t-lg"></div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold tracking-widest text-slate uppercase font-mono">HER</span>
            {herLocked && (
              <span className="text-[10px] font-semibold text-sage flex items-center gap-1 font-mono uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3" /> Locked
              </span>
            )}
          </div>

          <div className="space-y-4 font-sans">
            <label className="text-xs font-semibold text-slate block uppercase tracking-wider text-[10px]">Enter her guess (30 - 70):</label>
            <div className="relative">
              <input
                type={herHide && !herLocked ? 'password' : 'text'}
                pattern="[0-9]*"
                inputMode="numeric"
                disabled={herLocked}
                value={herGuess}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setHerGuess(val);
                }}
                placeholder="—"
                className="w-full bg-white border border-line rounded-lg px-4 py-3 text-ink font-mono text-center text-lg font-semibold focus:outline-none focus:border-sage transition-all disabled:opacity-75 disabled:bg-line/20"
              />
              
              {!herLocked && herGuess && (
                <button
                  type="button"
                  onClick={() => setHerHide(!herHide)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate hover:text-ink transition-colors"
                >
                  {herHide ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              )}
            </div>

            <button
              onClick={() => {
                if (!herGuess) return;
                setHerLocked(true);
                setErrorMessage('');
              }}
              disabled={herLocked || !herGuess}
              className={`w-full py-2.5 rounded-lg font-semibold text-[10px] transition-all tracking-wider uppercase flex items-center justify-center gap-2 ${
                herLocked
                  ? 'bg-line/20 text-slate border border-line'
                  : 'bg-slate hover:bg-ink text-white cursor-pointer active:scale-98'
              }`}
            >
              Lock Guess
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-amber font-semibold text-center mb-4 font-sans uppercase tracking-wider">{errorMessage}</p>
      )}

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center font-sans">
        <button
          onClick={calculateResult}
          disabled={!youLocked || !herLocked}
          id="reveal-winner-btn"
          className={`px-6 py-3 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all duration-200 ${
            youLocked && herLocked
              ? 'bg-slate hover:bg-ink text-white hover:shadow-xs cursor-pointer active:scale-98'
              : 'bg-line/30 text-slate border border-line cursor-not-allowed'
          }`}
        >
          {youLocked && herLocked ? 'Reveal Winner & View Results' : 'Awaiting Both Guesses'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[10px] text-slate hover:text-ink font-semibold uppercase tracking-wider px-4 py-3 border border-line hover:bg-bg rounded-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Re-shuffle
          </button>
          <button
            onClick={onGoHome}
            className="text-[10px] text-slate hover:text-ink font-semibold uppercase tracking-wider px-4 py-3 border border-line hover:bg-bg rounded-lg transition-all"
          >
            Exit Game
          </button>
        </div>
      </div>
    </motion.div>
  );
}

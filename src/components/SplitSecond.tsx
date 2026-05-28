import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, RotateCcw, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SplitSecondProps {
  onGameOver: (winner: 'you' | 'her' | 'tie', summary: string) => void;
  onGoHome: () => void;
  key?: string;
}

type GamePhase = 
  | 'idle' 
  | 'turn1-intro' 
  | 'turn1-countdown' 
  | 'turn1-running' 
  | 'turn2-intro' 
  | 'turn2-countdown' 
  | 'turn2-running' 
  | 'completed';

export default function SplitSecond({ onGameOver, onGoHome }: SplitSecondProps) {
  const [targetTime, setTargetTime] = useState<number>(0);
  const [gameState, setGameState] = useState<GamePhase>('idle');
  const [countdown, setCountdown] = useState<number>(3);
  const [currentTime, setCurrentTime] = useState<number>(0.0);
  
  // Dynamic player timing capture
  const [youTime, setYouTime] = useState<number | null>(null);
  const [herTime, setHerTime] = useState<number | null>(null);

  // Configuration options 
  const [flipHer, setFlipHer] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const startTimestampRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    generateTarget();
    return () => {
      stopRefs();
    };
  }, []);

  const generateTarget = () => {
    // Elegant timing target between 7.00 and 13.00 seconds
    const target = parseFloat((Math.random() * 6.0 + 7.0).toFixed(2));
    setTargetTime(target);
  };

  const stopRefs = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const startCountdown = (nextPhase: 'turn1-running' | 'turn2-running') => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          startTimer(nextPhase);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    timerRef.current = interval as unknown as number;
  };

  const startTimer = (runningPhase: 'turn1-running' | 'turn2-running') => {
    setGameState(runningPhase);
    startTimestampRef.current = performance.now();

    const updateTimer = () => {
      const elapsed = (performance.now() - startTimestampRef.current) / 1000;
      setCurrentTime(elapsed);

      // Force auto-completion if player forgets to tap
      const maxTime = targetTime + 4.0;
      if (elapsed >= maxTime) {
        stopRefs();
        if (runningPhase === 'turn1-running') {
          setYouTime(parseFloat(maxTime.toFixed(3)));
          setGameState('turn2-intro');
        } else {
          setHerTime(parseFloat(maxTime.toFixed(3)));
          setGameState('completed');
        }
        return;
      }

      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    animationFrameRef.current = requestAnimationFrame(updateTimer);
  };

  const handleTap = (player: 'you' | 'her') => {
    stopRefs();
    const tappedAt = parseFloat(((performance.now() - startTimestampRef.current) / 1000).toFixed(3));
    
    if (player === 'you') {
      setYouTime(tappedAt);
      setGameState('turn2-intro');
    } else {
      setHerTime(tappedAt);
      setGameState('completed');
    }
  };

  const calculateResult = () => {
    const yt = youTime !== null ? youTime : parseFloat(targetTime.toFixed(3));
    const ht = herTime !== null ? herTime : parseFloat(targetTime.toFixed(3));

    const youDiff = Math.abs(yt - targetTime);
    const herDiff = Math.abs(ht - targetTime);

    let winner: 'you' | 'her' | 'tie';
    let summaryText = '';

    if (youDiff < herDiff) {
      winner = 'you';
      summaryText = `Target: ${targetTime.toFixed(2)}s. You were extremely accurate, tapping at ${yt.toFixed(3)}s (diff: ${youDiff.toFixed(3)}s). Her tapped at ${ht.toFixed(3)}s (diff: ${herDiff.toFixed(3)}s). You win this strike!`;
    } else if (herDiff < youDiff) {
      winner = 'her';
      summaryText = `Target: ${targetTime.toFixed(2)}s. Her was closer, tapping at ${ht.toFixed(3)}s (diff: ${herDiff.toFixed(3)}s). You tapped at ${yt.toFixed(3)}s (diff: ${youDiff.toFixed(3)}s). She claims the victory!`;
    } else {
      winner = 'tie';
      summaryText = `Target: ${targetTime.toFixed(2)}s. Absolute double match! You both got exactly a difference of ${youDiff.toFixed(3)}s! Play again to settle the tie.`;
    }

    onGameOver(winner, summaryText);
  };

  useEffect(() => {
    if (gameState === 'completed') {
      const timeout = setTimeout(() => {
        calculateResult();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  const handleReset = () => {
    stopRefs();
    generateTarget();
    setYouTime(null);
    setHerTime(null);
    setCurrentTime(0.0);
    setGameState('idle');
  };

  const isBlindPeriod = 
    (gameState === 'turn1-running' || gameState === 'turn2-running') && 
    currentTime >= (targetTime - 2.0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-2xl mx-auto p-5 sm:p-7 bg-white rounded-xl border border-line shadow-xs flex flex-col gap-4 relative"
    >
      {/* 1. IDLE/INTRO SCREEN */}
      {gameState === 'idle' && (
        <div className="text-center py-6">
          <span className="px-3 py-1 text-[10px] font-bold text-sage bg-bg border border-line rounded-full uppercase tracking-widest font-mono">
            Game 2: Split-Second Strike
          </span>
          <h2 className="text-2xl font-serif text-ink mt-3 font-normal italic tracking-tight">
            Turn-Based Precision Timing
          </h2>
          <p className="text-xs sm:text-sm text-slate max-w-md mx-auto mt-2 mb-6 leading-relaxed">
            Avoid screen lag or multi-touch interference with beautiful turn-taking play. 
            Both players try to tap the screen as close to the target time as possible. 
            The counting display goes blind <strong className="text-ink">2 seconds before</strong> the target duration!
          </p>

          <div className="bg-bg border border-line p-4 rounded-lg max-w-xs mx-auto mb-6">
            <span className="text-[9px] font-bold tracking-widest text-[#4A5568]/60 block uppercase font-mono mb-1">Shared Target Duration</span>
            <div className="flex items-center justify-center gap-1.5 text-ink">
              <Timer className="w-4 h-4 text-sage" />
              <span className="text-3xl font-serif italic text-ink">{targetTime.toFixed(2)}s</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center font-sans">
            <button
              onClick={() => {
                setGameState('turn1-intro');
                setYouTime(null);
                setHerTime(null);
              }}
              id="start-split-game-btn"
              className="px-6 py-3 bg-slate hover:bg-ink text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Start Turn Challenge
            </button>
            <button
              onClick={onGoHome}
              className="text-[10px] text-slate hover:text-ink font-semibold uppercase tracking-wider px-4 py-3 border border-line hover:bg-bg rounded-lg transition-all cursor-pointer"
            >
              Exit Game
            </button>
          </div>
        </div>
      )}

      {/* 2. TURN 1 INTRO (YOU) */}
      {gameState === 'turn1-intro' && (
        <div className="text-center py-8 bg-bg border border-line rounded-lg">
          <span className="text-[9px] font-bold tracking-widest text-slate font-mono uppercase">Round Strike #1</span>
          <h3 className="text-xl font-serif text-ink mt-1 italic">First Player: YOU</h3>
          <p className="text-xs text-slate max-w-sm mx-auto mt-2 mb-6 leading-relaxed">
            Ready to test your precision? Hold your finger prepared, then hit start. The live clock goes blind at {(targetTime - 2.0).toFixed(1)}s!
          </p>

          <button
            onClick={() => {
              setGameState('turn1-countdown');
              startCountdown('turn1-running');
            }}
            className="px-6 py-3 bg-slate hover:bg-ink text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer active:scale-98"
          >
            Start My Turn ➔
          </button>
        </div>
      )}

      {/* COUNTDOWN STATES */}
      {(gameState === 'turn1-countdown' || gameState === 'turn2-countdown') && (
        <div className="flex flex-col items-center justify-center py-20 bg-bg rounded-lg border border-line">
          <motion.span
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-6xl font-serif italic text-sage"
          >
            {countdown === 0 ? "GO!" : countdown}
          </motion.span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate font-mono mt-4">Place finger, stay ready!</span>
        </div>
      )}

      {/* 3. TURN 1 INTERACTIVE ZONE (YOU) */}
      {gameState === 'turn1-running' && (
        <div className="flex flex-col h-[380px] border border-line rounded-lg overflow-hidden relative">
          {/* Large Tap Zone */}
          <button
            onClick={() => handleTap('you')}
            className="w-full flex-1 flex flex-col items-center justify-center p-6 bg-white hover:bg-bg text-slate cursor-pointer active:bg-bg/25 select-none transition-all duration-150"
          >
            <span className="text-[10px] font-bold tracking-widest text-slate/55 uppercase font-mono">YOUR ZONE</span>
            <p className="text-2xl font-serif italic mt-2 font-normal text-ink animate-pulse">
              TAP AS CLOSE TO {targetTime.toFixed(2)}s AS POSSIBLE!
            </p>
            <span className="text-[10px] font-mono text-sage mt-2 uppercase tracking-wider">TAP ANYWHERE TO CAPTURE</span>
          </button>

          {/* Central Overlay HUD */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-5 py-3 rounded-lg border border-line shadow-xs flex flex-col items-center gap-1 z-20 min-w-[210px]">
            <span className="text-[9px] font-bold tracking-widest text-[#4A5568]/60 uppercase font-mono">TARGET: {targetTime.toFixed(2)}s</span>
            <div className="h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isBlindPeriod ? (
                  <motion.div
                    key="blind"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold text-slate uppercase tracking-widest font-mono border border-line bg-bg animate-pulse"
                  >
                    <AlertCircle className="w-3 h-3 text-amber animate-bounce" /> Count In Your Head! 🤫
                  </motion.div>
                ) : (
                  <motion.span
                    key="number"
                    className="text-xl font-mono text-ink tracking-wide tabular-nums"
                  >
                    {currentTime.toFixed(2)}s
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* 4. TURN 2 INTERCONNECT TRANSITION (HER INTRO) */}
      {gameState === 'turn2-intro' && (
        <div className="text-center py-8 bg-bg border border-line rounded-lg">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[9px] text-sage font-bold bg-white border border-line rounded-full uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" /> Turn 1 Recorded
            </span>
          </div>
          <span className="text-[9px] font-bold tracking-widest text-[#4A5568]/60 uppercase font-mono block">Pass the device</span>
          <h3 className="text-xl font-serif text-ink mt-1 italic">Now Player 2: HER</h3>
          
          <p className="text-xs text-slate max-w-sm mx-auto mt-2 mb-6 leading-relaxed">
            Beautiful! You locked in your timing safely. Score is hidden to keep the duel perfectly fair. Hand the device over for her turn!
          </p>

          <div className="flex flex-col gap-2.5 justify-center items-center max-w-xs mx-auto">
            <button
              onClick={() => {
                setGameState('turn2-countdown');
                startCountdown('turn2-running');
              }}
              className="w-full py-3 bg-slate hover:bg-ink text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              Start Her Turn <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Optional opposite seating flipped display reminder */}
            <label className="flex items-center gap-2 py-1 text-[10px] text-slate cursor-pointer font-mono uppercase tracking-wider select-none">
              <input
                type="checkbox"
                checked={flipHer}
                onChange={(e) => setFlipHer(e.target.checked)}
                className="rounded border-line text-sage focus:ring-sage"
              />
              Flip Her Interface 180°
            </label>
          </div>
        </div>
      )}

      {/* 5. TURN 2 INTERACTIVE ZONE (HER) */}
      {gameState === 'turn2-running' && (
        <div className="flex flex-col h-[380px] border border-line rounded-lg overflow-hidden relative">
          {/* Large Tap Zone */}
          <button
            onClick={() => handleTap('her')}
            className="w-full flex-1 flex flex-col items-center justify-center p-6 bg-white hover:bg-bg text-slate cursor-pointer active:bg-bg/25 select-none transition-all duration-150"
          >
            <div className={`transition-transform duration-300 ${flipHer ? 'rotate-180' : ''} flex flex-col items-center`}>
              <span className="text-[10px] font-bold tracking-widest text-slate/55 uppercase font-mono">HER ZONE</span>
              <p className="text-2xl font-serif italic mt-2 font-normal text-ink animate-pulse text-center">
                TAP AS CLOSE TO {targetTime.toFixed(2)}s AS POSSIBLE!
              </p>
              <span className="text-[10px] font-mono text-amber mt-2 uppercase tracking-wider">TAP ANYWHERE TO COMPLETE ROUND</span>
            </div>
          </button>

          {/* Central Overlay HUD */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-5 py-3 rounded-lg border border-line shadow-xs flex flex-col items-center gap-1 z-20 min-w-[210px]">
            <span className="text-[9px] font-bold tracking-widest text-[#4A5568]/60 uppercase font-mono">TARGET: {targetTime.toFixed(2)}s</span>
            <div className="h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isBlindPeriod ? (
                  <motion.div
                    key="blind"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 px-2.5 py-0.5 rounded text-[9px] font-bold text-slate uppercase tracking-widest font-mono border border-line bg-bg animate-pulse"
                  >
                    <AlertCircle className="w-3 h-3 text-amber animate-bounce" /> Count In Your Head! 🤫
                  </motion.div>
                ) : (
                  <motion.span
                    key="number"
                    className="text-xl font-mono text-ink tracking-wide tabular-nums"
                  >
                    {currentTime.toFixed(2)}s
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* 6. WAITING PROCESS FOR COMPLETION */}
      {gameState === 'completed' && (
        <div className="flex flex-col items-center justify-center py-20 bg-bg rounded-lg border border-line text-center">
          <div className="w-10 h-10 border-2 border-line border-t-sage rounded-full animate-spin"></div>
          <span className="text-[10px] font-mono font-bold text-slate uppercase tracking-widest mt-4">
            Matching Precision Results...
          </span>
        </div>
      )}

      {/* EMERGENCY RESTART */}
      {gameState !== 'idle' && gameState !== 'completed' && (
        <div className="flex justify-center mt-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber hover:text-amber/80 px-4 py-2 border border-line bg-bg rounded-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Cancel & Restart
          </button>
        </div>
      )}
    </motion.div>
  );
}

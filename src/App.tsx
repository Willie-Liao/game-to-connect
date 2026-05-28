/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Stars, Sparkles, Flame, User, Users, AlignLeft, Info, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Modular component imports
import Scoreboard from './components/Scoreboard';
import MindReader from './components/MindReader';
import SplitSecond from './components/SplitSecond';
import WordUnscramble from './components/WordUnscramble';
import Feihualing from './components/Feihualing';
import CardReveal from './components/CardReveal';

type GameType = 'menu' | 'mind-reader' | 'split-second' | 'word-unscramble' | 'feihualing' | 'post-round' | 'direct-cards';

export default function App() {
  // Scoreboard statistics synchronizing state with standard local storage
  const [score, setScore] = useState<{ you: number; her: number }>({ you: 0, her: 0 });
  const [activeGame, setActiveGame] = useState<GameType>('menu');

  // Multi-state handlers for concluding a game and transitioning to Post-Round Reward screen
  const [roundWinner, setRoundWinner] = useState<'you' | 'her' | 'tie' | null>(null);
  const [roundSummary, setRoundSummary] = useState<string>('');

  useEffect(() => {
    try {
      const savedScore = localStorage.getItem('closer_game_scores');
      if (savedScore) {
        setScore(JSON.parse(savedScore));
      }
    } catch (e) {
      console.warn("Could not load scores from localStorage.", e);
    }
  }, []);

  const handleUpdateScore = (winner: 'you' | 'her' | 'tie') => {
    let newScore = { ...score };
    if (winner === 'you') {
      newScore.you += 1;
    } else if (winner === 'her') {
      newScore.her += 1;
    }
    // We do not increment for tie, keep it friendly and low stakes!
    setScore(newScore);
    try {
      localStorage.setItem('closer_game_scores', JSON.stringify(newScore));
    } catch (e) {
      console.warn("Could not save scores to localStorage.", e);
    }
  };

  const handleResetScores = () => {
    const fresh = { you: 0, her: 0 };
    setScore(fresh);
    try {
      localStorage.setItem('closer_game_scores', JSON.stringify(fresh));
    } catch (e) {
      console.warn("Could not reset scores.", e);
    }
  };

  const handleGameOver = (winner: 'you' | 'her' | 'tie', summary: string) => {
    setRoundWinner(winner);
    setRoundSummary(summary);
    handleUpdateScore(winner);
    setActiveGame('post-round');
  };

  const handleNextRound = () => {
    // Return to main screen, clear single-round winners
    setRoundWinner(null);
    setRoundSummary('');
    setActiveGame('menu');
  };

  const getActiveGameTitle = () => {
    switch (activeGame) {
      case 'mind-reader':
        return 'The Mind-Reader';
      case 'split-second':
        return 'Split-Second Strike';
      case 'word-unscramble':
        return 'Word Unscramble';
      case 'feihualing':
        return '飞花令 • Feihualing';
      case 'post-round':
        return 'Card Drawing Zone';
      case 'direct-cards':
        return 'Intimacy Cards Deck';
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col justify-start py-8 px-4 sm:px-6 relative selection:bg-sage/25 selection:text-ink">
      
      {/* Decorative top tiny status ambient indicator */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-sage"></div>

      {/* Persistent global Scoreboard component */}
      <Scoreboard
        score={score}
        onReset={handleResetScores}
        activeGameName={getActiveGameTitle()}
        onGoHome={() => setActiveGame('menu')}
      />

      {/* Main Connection Screen Routing Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto flex items-start justify-center">
        <AnimatePresence mode="wait">
          
          {/* Active Screen: MAIN MENU */}
          {activeGame === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="w-full space-y-6 animate-fade-in"
            >
              {/* Cozy Relationship Milestone Intro */}
              <div className="text-center py-6 bg-white rounded-xl p-8 border border-line shadow-xs relative">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-bg border border-line px-4 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Flame className="w-3 h-3 text-amber fill-amber/20" />
                  <span className="text-[9px] font-bold text-slate uppercase tracking-widest font-mono">Closeness Space</span>
                </div>
                
                <h2 className="text-3xl font-serif text-ink font-light tracking-tight mt-2 italic">
                  Building Us, Lightly
                </h2>
                <p className="text-xs sm:text-sm text-slate max-w-md mx-auto mt-3 leading-relaxed font-sans">
                  Four quick, low-intensity mini-games to spark laughter and conversations. The round winner draws a card, and the other answers aloud. No test, no test vibe—just connecting.
                </p>
                <div className="mt-5 pt-4 border-t border-line/40 flex justify-center">
                  <button
                    onClick={() => setActiveGame('direct-cards')}
                    id="direct-draw-cue-btn"
                    className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-bg border border-line bg-white hover:border-sage text-slate hover:text-ink text-[10px] font-mono uppercase tracking-widest rounded-lg transition-all duration-150 cursor-pointer shadow-xs active:scale-97"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-sage" /> Browse & Draw Cards Directly
                  </button>
                </div>
              </div>

              {/* Game Grid selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Game 1 Selector Card */}
                <button
                  onClick={() => setActiveGame('mind-reader')}
                  id="menu-game-1"
                  className="bg-white hover:bg-bg border border-line hover:border-sage p-6 rounded-xl text-left transition-all hover:translate-y-[-2px] hover:shadow-xs cursor-pointer flex flex-col justify-between group relative overflow-hidden h-48"
                >
                  <div className="absolute top-0 right-0 w-10 h-10 bg-bg rounded-bl-[30px] flex items-start justify-end p-2 opacity-50 group-hover:bg-sage/10 transition-colors">
                    <Stars className="w-3.5 h-3.5 text-sage group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="h-full flex flex-col justify-between">
                    <span className="text-[9px] font-bold font-mono tracking-widest text-slate/70 uppercase block">Interactive • Side-by-Side</span>
                    <div>
                      <h3 className="text-lg font-serif font-normal text-ink group-hover:text-amber transition-colors">The Mind-Reader</h3>
                      <p className="text-xs text-slate mt-1.5 leading-relaxed">
                        A secret target number is generated from 30 to 70. Both players secretly guess. Closest wins their round card draw.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Game 2 Selector Card */}
                <button
                  onClick={() => setActiveGame('split-second')}
                  id="menu-game-2"
                  className="bg-white hover:bg-bg border border-line hover:border-sage p-6 rounded-xl text-left transition-all hover:translate-y-[-2px] hover:shadow-xs cursor-pointer flex flex-col justify-between group relative overflow-hidden h-48"
                >
                  <div className="absolute top-0 right-0 w-10 h-10 bg-bg rounded-bl-[30px] flex items-start justify-end p-2 opacity-50 group-hover:bg-sage/10 transition-colors">
                    <HeartsIcon className="w-3.5 h-3.5 text-sage group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="h-full flex flex-col justify-between">
                    <span className="text-[9px] font-bold font-mono tracking-widest text-slate/70 uppercase block">Direct Precision Duel</span>
                    <div>
                      <h3 className="text-lg font-serif font-normal text-ink group-hover:text-amber transition-colors">Split-Second Strike</h3>
                      <p className="text-xs text-slate mt-1.5 leading-relaxed">
                        Split-screen timing battle! Tap as close to target as possible—digits vanish 2s early to challenge your pacing!
                      </p>
                    </div>
                  </div>
                </button>

                {/* Game 3 Selector Card */}
                <button
                  onClick={() => setActiveGame('word-unscramble')}
                  id="menu-game-3"
                  className="bg-white hover:bg-bg border border-line hover:border-sage p-6 rounded-xl text-left transition-all hover:translate-y-[-2px] hover:shadow-xs cursor-pointer flex flex-col justify-between group relative overflow-hidden h-48"
                >
                  <div className="absolute top-0 right-0 w-10 h-10 bg-bg rounded-bl-[30px] flex items-start justify-end p-2 opacity-50 group-hover:bg-sage/10 transition-colors">
                    <Sparkles className="w-3.5 h-3.5 text-sage group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="h-full flex flex-col justify-between">
                    <span className="text-[9px] font-bold font-mono tracking-widest text-slate/70 uppercase block">Concept Riddle • Speed</span>
                    <div>
                      <h3 className="text-lg font-serif font-normal text-ink group-hover:text-amber transition-colors">Word Unscramble</h3>
                      <p className="text-xs text-slate mt-1.5 leading-relaxed">
                        Puzzles regarding relationship terms and cozy concepts. Be the first to type the correct solution to claim the round.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Game 4 Selector Card */}
                <button
                  onClick={() => setActiveGame('feihualing')}
                  id="menu-game-4"
                  className="bg-white hover:bg-bg border border-line hover:border-sage p-6 rounded-xl text-left transition-all hover:translate-y-[-2px] hover:shadow-xs cursor-pointer flex flex-col justify-between group relative overflow-hidden h-48"
                >
                  <div className="absolute top-0 right-0 w-10 h-10 bg-bg rounded-bl-[30px] flex items-start justify-end p-2 opacity-50 group-hover:bg-sage/10 transition-colors">
                    <BookOpen className="w-3.5 h-3.5 text-sage group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="h-full flex flex-col justify-between">
                    <span className="text-[9px] font-bold font-mono tracking-widest text-slate/70 uppercase block">Poetic parlor game • Calm</span>
                    <div>
                      <h3 className="text-lg font-serif font-normal text-ink group-hover:text-amber transition-colors">飞花令 • Feihualing</h3>
                      <p className="text-xs text-slate mt-1.5 leading-relaxed">
                        Improvise strings, songs, or poetry containing natural character keywords (Moon, Wind, River). Expressive and stress-free.
                      </p>
                    </div>
                  </div>
                </button>

              </div>

              {/* Informative tips to support a calm space */}
              <div className="w-full p-5 rounded-xl border border-line bg-white shadow-xs text-slate flex gap-3 items-start font-sans">
                <Info className="w-4 h-4 text-slate shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed space-y-1">
                  <p className="font-semibold text-ink uppercase tracking-wider text-[10px]">How to play beautifully:</p>
                  <p className="text-slate/90">Lay down a shared phone space. Take turns entering inputs or split screens in physical warmth. Listen generously to your partner's voice when cards are drawn.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Screen: Game 1 - Mind Reader */}
          {activeGame === 'mind-reader' && (
            <MindReader
              key="mind"
              onGameOver={handleGameOver}
              onGoHome={handleNextRound}
            />
          )}

          {/* Active Screen: Game 2 - Split Second Timing */}
          {activeGame === 'split-second' && (
            <SplitSecond
              key="split"
              onGameOver={handleGameOver}
              onGoHome={handleNextRound}
            />
          )}

          {/* Active Screen: Game 3 - Word Unscramble */}
          {activeGame === 'word-unscramble' && (
            <WordUnscramble
              key="unscramble"
              onGameOver={handleGameOver}
              onGoHome={handleNextRound}
            />
          )}

          {/* Active Screen: Game 4 - Feihualing */}
          {activeGame === 'feihualing' && (
            <Feihualing
              key="feihua"
              onGameOver={handleGameOver}
              onGoHome={handleNextRound}
            />
          )}

          {/* Active Screen: POST-ROUND STAGE */}
          {activeGame === 'post-round' && roundWinner && (
            <CardReveal
              key="reveal"
              winner={roundWinner}
              summary={roundSummary}
              onNextRound={handleNextRound}
            />
          )}

          {/* Active Screen: DIRECT INTOMACY DRAW */}
          {activeGame === 'direct-cards' && (
            <CardReveal
              key="direct-reveal"
              direct={true}
              onNextRound={handleNextRound}
            />
          )}

        </AnimatePresence>
      </main>

      {/* Footer Branding Area */}
      <footer className="w-full text-center py-6 mt-8 border-t border-line">
        <p className="text-[9px] font-mono tracking-widest text-[#4A5568]/60 uppercase">
          ✦ Designed for Hearts • Powered by Warm Presence ✦
        </p>
      </footer>
    </div>
  );
}

// Inline minor icon to prevent multiple imports
function HeartsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

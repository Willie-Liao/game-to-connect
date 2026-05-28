import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, RefreshCw, Clock, CheckCircle2, Play, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { FEIHUALING_CHAR_POOL } from '../data';

interface FeihualingProps {
  onGameOver: (winner: 'you' | 'her' | 'tie', summary: string) => void;
  onGoHome: () => void;
  key?: string;
}

// Nature translations lookup to elevate accessibility and romance
const CHAR_TRANSLATIONS: Record<string, string> = {
  "花": "Flower", "雨": "Rain", "月": "Moon", "山": "Mountain", "风": "Wind", 
  "春": "Spring", "夜": "Night", "酒": "Wine", "云": "Cloud", "水": "Water", 
  "雪": "Snow", "江": "River", "海": "Sea", "星": "Star", "日": "Sun", 
  "秋": "Autumn", "夏": "Summer", "冬": "Winter", "竹": "Bamboo", "松": "Pine", 
  "梅": "Plum blossom", "霜": "Frost", "露": "Dew", "溪": "Creek", "湖": "Lake", 
  "舟": "Boat", "草": "Grass", "叶": "Leaf", "石": "Stone", "天": "Sky", "心": "Heart"
};

// Poetic hints for characters to inspire couples
const POETIC_HINTS: Record<string, string> = {
  "花": "e.g. '花开堪折直须折' / 'Flowers are blooming'",
  "月": "e.g. '海上生明月' / 'The moon shines bright'",
  "雨": "e.g. '清明时节雨纷纷' / 'Dancing in the rain'",
  "山": "e.g. '悠然见南山' / 'The great mountains'",
  "风": "e.g. '春风不度玉门关' / 'The wind barely blows across the Gobi Desert'",
  "心": "e.g. '愿得一心人' / 'One devoted heart'",
};

export default function Feihualing({ onGameOver, onGoHome }: FeihualingProps) {
  const [character, setCharacter] = useState<string>('');
  const [translation, setTranslation] = useState<string>('');
  
  // Game states
  const [gameState, setGameState] = useState<'idle' | 'running'>('idle');
  const [activePlayer, setActivePlayer] = useState<'you' | 'her'>('you');
  const [timeLeft, setTimeLeft] = useState<number>(40);
  const [hasRecited, setHasRecited] = useState<boolean>(false);
  const [poemsCount, setPoemsCount] = useState<number>(0);

  // Refs for tracking active variables in stale closures
  const activePlayerRef = useRef(activePlayer);
  const poemsCountRef = useRef(poemsCount);
  const characterRef = useRef(character);

  useEffect(() => {
    drawCharacter();
  }, []);

  useEffect(() => {
    activePlayerRef.current = activePlayer;
  }, [activePlayer]);

  useEffect(() => {
    poemsCountRef.current = poemsCount;
  }, [poemsCount]);

  useEffect(() => {
    characterRef.current = character;
  }, [character]);

  // Unified running clock effect
  useEffect(() => {
    let interval: number | null = null;
    if (gameState === 'running') {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeOut();
            return 0;
          }
          return prev - 1;
        });
      }, 1000) as unknown as number;
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, activePlayer]);

  const handleTimeOut = () => {
    setGameState('idle');
    const currentActive = activePlayerRef.current;
    const currentPoems = poemsCountRef.current;
    const currentCharacter = characterRef.current;
    
    const winner = currentActive === 'you' ? 'her' : 'you';
    const loserName = currentActive === 'you' ? 'You' : 'Her';
    const winnerName = winner === 'you' ? 'You' : 'Her';
    
    onGameOver(
      winner,
      `${loserName} ran out of the 40-second turn timer while looking for a poem containing "${currentCharacter}". ${winnerName} claims the victory! Beautiful poems successfully shared in this duel: ${currentPoems}.`
    );
  };

  const drawCharacter = () => {
    const randomIndex = Math.floor(Math.random() * FEIHUALING_CHAR_POOL.length);
    const selectedChar = FEIHUALING_CHAR_POOL[randomIndex];
    setCharacter(selectedChar);
    setTranslation(CHAR_TRANSLATIONS[selectedChar] || "Nature Symbol");
    
    // Reset state
    setGameState('idle');
    setPoemsCount(0);
    setActivePlayer('you');
    setHasRecited(false);
    setTimeLeft(40);
  };

  const handleStartDuel = () => {
    setGameState('running');
    setActivePlayer('you');
    setPoemsCount(0);
    setHasRecited(false);
    setTimeLeft(40);
  };

  const handleSwapTimer = () => {
    if (!hasRecited) return;
    
    setPoemsCount((prev) => prev + 1);
    setHasRecited(false);
    setTimeLeft(40);
    setActivePlayer((prev) => (prev === 'you' ? 'her' : 'you'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full max-w-2xl mx-auto p-5 sm:p-7 bg-white rounded-xl border border-line shadow-xs"
    >
      <div className="text-center mb-6">
        <span className="px-3 py-1 text-[10px] font-bold text-sage bg-bg border border-line rounded-full uppercase tracking-widest font-mono">
          Game 4: 飞花令 — Feihualing
        </span>
        <h2 className="text-3xl font-serif text-ink mt-3 font-normal italic tracking-tight">
          Nature's Poetry Chain
        </h2>
        <p className="text-xs sm:text-sm text-slate max-w-sm mx-auto mt-2 font-sans leading-relaxed">
          Quote poetry or song lyrics containing the natural character keyword! A clean, responsive 40-second turn timer is shared to spark quick wit.
        </p>
      </div>

      {/* Main Character Showcase Board */}
      <div className="bg-bg border border-line rounded-lg p-6 mb-6 text-center relative flex flex-col items-center">
        {gameState === 'running' && (
          <div className="absolute top-3.5 left-4 flex items-center gap-1.5 text-[9px] text-slate uppercase font-mono tracking-wider">
            <Volume2 className="w-3.5 h-3.5 text-sage animate-pulse" />
            <span>Reciting Poem #{poemsCount + 1}...</span>
          </div>
        )}

        <div className="absolute top-3 right-4">
          <button 
            onClick={drawCharacter} 
            className="p-1 px-2.5 rounded-md border border-line hover:border-sage bg-white text-[9px] text-slate hover:text-ink transition-all font-semibold uppercase tracking-wider flex items-center gap-1 active:scale-95 cursor-pointer"
            title="Redraw new character"
            id="redraw-char-btn"
          >
            <RefreshCw className="w-3 h-3 text-sage" /> New character
          </button>
        </div>

        {/* Big Chinese Calligraphy Character Display */}
        <motion.div
          key={character}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="my-3 flex flex-col items-center justify-center w-24 h-24 rounded-lg bg-white border border-line shadow-xs relative"
        >
          <span className="text-5xl font-serif text-ink leading-none select-none">{character}</span>
          <span className="text-slate absolute -bottom-1 text-[8px] tracking-widest font-bold uppercase font-mono bg-bg border border-line p-0.5 px-2 rounded-full shadow-xs">
            Symbol
          </span>
        </motion.div>

        {/* Translation Guidance Card */}
        <span className="text-base font-serif font-semibold italic text-ink block mb-1">
          "{translation}"
        </span>
        <span className="text-[10px] text-slate font-mono uppercase tracking-wider block">
          {POETIC_HINTS[character] || `e.g. Any text containing the character "${character}"`}
        </span>
      </div>

      {/* Duel Layout according to Game State */}
      {gameState === 'idle' ? (
        <div className="p-6 bg-bg rounded-lg border border-line text-center mb-6 font-sans">
          <h3 className="text-sm font-semibold tracking-wider text-ink uppercase mb-2">Timer Duel Rules</h3>
          
          <div className="text-xs sm:text-sm text-slate space-y-3 leading-relaxed max-w-md mx-auto mb-6">
            <p>1. This is a verbal close-up parlor game. You do not need to type anything!</p>
            <p>2. Tap start to begin. The active player has a <strong className="text-ink">40-second turn limit</strong>.</p>
            <p>3. Once you verbally quote a poem, song lyric, or custom coupling containing the character <strong className="text-sage">"{character}"</strong> aloud, check the confirmation box to unlock and swap the timer.</p>
            <p>4. Swap immediately to pass the active clock to your partner! If the clock hits zero, you lose!</p>
          </div>

          <button
            onClick={handleStartDuel}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate hover:bg-ink text-white font-semibold text-xs rounded-lg uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 mx-auto cursor-pointer active:scale-98"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Start Timer Duel Challenge
          </button>
        </div>
      ) : (
        <div className="space-y-6 mb-6">
          {/* Symmetrical Duel Panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Player You Panel */}
            <div 
              className={`p-5 rounded-lg border transition-all duration-300 relative flex flex-col justify-between min-h-[200px] ${
                activePlayer === 'you'
                  ? 'border-sage bg-sage/5 scale-102 ring-1 ring-sage/10'
                  : 'border-line bg-bg/40 opacity-50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold tracking-widest text-slate uppercase font-mono">YOU</span>
                {activePlayer === 'you' ? (
                  <span className="text-[9px] font-bold text-sage uppercase font-mono animate-pulse">Your Turn ✦</span>
                ) : (
                  <span className="text-[9px] text-slate uppercase font-mono">Waiting...</span>
                )}
              </div>

              {/* Countdown Big Display */}
              <div className="text-center my-4">
                <span className={`text-4xl font-serif italic ${activePlayer === 'you' && timeLeft <= 10 ? 'text-amber font-normal' : 'text-ink'}`}>
                  {timeLeft}s
                </span>
                <p className="text-[9px] text-slate mt-1 uppercase font-mono tracking-wider">
                  {activePlayer === 'you' ? 'remaining standard time' : 'clock paused'}
                </p>
              </div>

              {/* Actions */}
              <div>
                {activePlayer === 'you' ? (
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 justify-center p-2.5 bg-white border border-line rounded-md cursor-pointer hover:bg-bg transition-all select-none">
                      <input
                        type="checkbox"
                        checked={hasRecited}
                        onChange={(e) => setHasRecited(e.target.checked)}
                        className="w-4 h-4 rounded text-sage focus:ring-sage border-line cursor-pointer"
                      />
                      <span className="text-[10px] font-semibold text-slate uppercase tracking-wider">
                        I said a poem with "{character}"
                      </span>
                    </label>

                    <button
                      disabled={!hasRecited}
                      onClick={handleSwapTimer}
                      className={`w-full py-2.5 rounded-md font-semibold text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        hasRecited
                          ? "bg-slate hover:bg-ink text-white cursor-pointer active:scale-98"
                          : "bg-line/20 text-slate/40 border border-line cursor-not-allowed"
                      }`}
                    >
                      Swap Timer to Her ➔
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-[10px] text-slate font-mono italic p-3">
                    Recite in your head or support her!
                  </div>
                )}
              </div>
            </div>

            {/* Player Her Panel */}
            <div 
              className={`p-5 rounded-lg border transition-all duration-300 relative flex flex-col justify-between min-h-[200px] ${
                activePlayer === 'her'
                  ? 'border-amber bg-amber/5 scale-102 ring-1 ring-amber/10'
                  : 'border-line bg-bg/40 opacity-50'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold tracking-widest text-slate uppercase font-mono">HER</span>
                {activePlayer === 'her' ? (
                  <span className="text-[9px] font-bold text-amber uppercase font-mono animate-pulse">Her Turn ✦</span>
                ) : (
                  <span className="text-[9px] text-slate uppercase font-mono">Waiting...</span>
                )}
              </div>

              {/* Countdown Big Display */}
              <div className="text-center my-4">
                <span className={`text-4xl font-serif italic ${activePlayer === 'her' && timeLeft <= 10 ? 'text-amber font-normal' : 'text-ink'}`}>
                  {timeLeft}s
                </span>
                <p className="text-[9px] text-slate mt-1 uppercase font-mono tracking-wider">
                  {activePlayer === 'her' ? 'remaining standard time' : 'clock paused'}
                </p>
              </div>

              {/* Actions */}
              <div>
                {activePlayer === 'her' ? (
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 justify-center p-2.5 bg-white border border-line rounded-md cursor-pointer hover:bg-bg transition-all select-none">
                      <input
                        type="checkbox"
                        checked={hasRecited}
                        onChange={(e) => setHasRecited(e.target.checked)}
                        className="w-4 h-4 rounded text-sage focus:ring-sage border-line cursor-pointer"
                      />
                      <span className="text-[10px] font-semibold text-slate uppercase tracking-wider">
                        She said a poem with "{character}"
                      </span>
                    </label>

                    <button
                      disabled={!hasRecited}
                      onClick={handleSwapTimer}
                      className={`w-full py-2.5 rounded-md font-semibold text-[10px] uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 ${
                        hasRecited
                          ? "bg-slate hover:bg-ink text-white cursor-pointer active:scale-98"
                          : "bg-line/20 text-slate/40 border border-line cursor-not-allowed"
                      }`}
                    >
                      Swap Timer to You ➔
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-[10px] text-slate font-mono italic p-3">
                    Listen closely and warm your heart...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Core game metadata stats bar */}
          <div className="flex justify-between items-center bg-bg/50 border border-line p-3 rounded-lg text-[10px] text-slate uppercase font-mono tracking-wide">
            <span>Beautiful Poems Spoken: {poemsCount}</span>
            <span>Current Active: <strong className="text-ink">{activePlayer === 'you' ? 'You' : 'Her'}</strong></span>
          </div>
        </div>
      )}

      {/* Control Actions */}
      <div className="flex justify-center gap-3">
        {gameState === 'running' && (
          <button
            onClick={() => {
              setGameState('idle');
            }}
            className="flex items-center gap-1.5 text-[10px] text-amber hover:text-amber/80 font-semibold uppercase tracking-wider px-4 py-3 border border-line bg-bg rounded-lg transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" /> Emergency Pause
          </button>
        )}
        <button
          onClick={drawCharacter}
          className="flex items-center gap-1.5 text-[10px] text-slate hover:text-ink font-semibold uppercase tracking-wider px-4 py-3 border border-line hover:bg-bg rounded-lg transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-sage" /> Swap Character
        </button>
        <button
          onClick={onGoHome}
          className="text-[10px] text-slate hover:text-ink font-semibold uppercase tracking-wider px-4 py-3 border border-line hover:bg-bg rounded-lg transition-all cursor-pointer"
        >
          Exit Game
        </button>
      </div>
    </motion.div>
  );
}

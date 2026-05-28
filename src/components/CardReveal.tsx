import React, { useState, useEffect } from 'react';
import { 
  Award, 
  BookOpen, 
  Quote, 
  ChevronRight, 
  HelpCircle, 
  Heart, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Plus, 
  Search, 
  Undo2, 
  Check, 
  X,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, GREEN_POOL, YELLOW_POOL } from '../data';

interface CardRevealProps {
  winner?: 'you' | 'her' | 'tie';
  summary?: string;
  onNextRound: () => void;
  direct?: boolean;
  key?: string;
}

interface ManageableQuestion {
  id: string;
  text: string;
  pool: 'green' | 'yellow';
  enabled: boolean;
}

const LOCAL_STORAGE_KEY = 'couple-connection-manageable-questions';

function getStoredQuestions(): ManageableQuestion[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to parse stored questions:", e);
  }
  
  // Prefill default questions beautifully
  const defaults: ManageableQuestion[] = [
    ...GREEN_POOL.map((q, i) => ({ id: `green-${i}`, text: q.text, pool: 'green' as const, enabled: true })),
    ...YELLOW_POOL.map((q, i) => ({ id: `yellow-${i}`, text: q.text, pool: 'yellow' as const, enabled: true }))
  ];
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaults));
  } catch (e) {}
  return defaults;
}

function saveStoredQuestions(questions: ManageableQuestion[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error("Failed to save questions to localStorage:", e);
  }
}

export default function CardReveal({ winner = 'tie', summary = '', onNextRound, direct = false }: CardRevealProps) {
  const [currentStep, setCurrentStep] = useState<'post-round' | 'animating' | 'card-reveal'>('post-round');
  const [drawnQuestion, setDrawnQuestion] = useState<Question | null>(null);
  
  // Manageable deck states
  const [questions, setQuestions] = useState<ManageableQuestion[]>(() => getStoredQuestions());
  const [subView, setSubView] = useState<'draw' | 'manage'>('draw');
  
  // Custom question add controls
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionPool, setNewQuestionPool] = useState<'green' | 'yellow'>('green');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Editing individual questions states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Persist edits Whenever questions change
  const updateQuestions = (newQuestions: ManageableQuestion[]) => {
    setQuestions(newQuestions);
    saveStoredQuestions(newQuestions);
  };

  const drawCard = () => {
    const activeQuestions = questions.filter(q => q.enabled);
    
    setCurrentStep('animating');

    // If no questions are checked/enabled, alert or draw from fallback
    if (activeQuestions.length === 0) {
      setTimeout(() => {
        setDrawnQuestion({
          text: "No customized cards enabled. Go to Deck Manager to enable/add questions! Let's share: What's a dream of yours?",
          pool: 'green'
        });
        setCurrentStep('card-reveal');
      }, 700);
      return;
    }

    // Attempting 60/40 selection with enabled questions
    const randomFloat = Math.random();
    const targetPool: 'green' | 'yellow' = randomFloat > 0.6 ? 'yellow' : 'green';
    
    let poolCandidates = activeQuestions.filter(q => q.pool === targetPool);
    if (poolCandidates.length === 0) {
      // fallback to any active question
      poolCandidates = activeQuestions;
    }

    const randomIndex = Math.floor(Math.random() * poolCandidates.length);
    const question = poolCandidates[randomIndex];

    // Artificial timing delay
    setTimeout(() => {
      setDrawnQuestion({
        text: question.text,
        pool: question.pool
      });
      setCurrentStep('card-reveal');
    }, 700);
  };

  const getWinnerName = () => {
    if (winner === 'you') return 'You';
    if (winner === 'her') return 'Her';
    return 'Both of you';
  };

  const getLoserPrompt = () => {
    if (direct) return 'Share your perspectives';
    if (winner === 'you') return 'Her answers';
    if (winner === 'her') return 'You answer';
    return 'Take turns answering';
  };

  const getLoserSubtext = () => {
    if (direct) return 'Take turns sharing with warm presence, active listening, and safe space.';
    if (winner === 'you') return 'Speak from the heart. You listen with presence.';
    if (winner === 'her') return 'Speak from the heart. She listens with presence.';
    return 'Share together without judgment.';
  };

  // Toggle toggle-enabled checkbox
  const toggleQuestionEnabled = (id: string) => {
    const updated = questions.map(q => 
      q.id === id ? { ...q, enabled: !q.enabled } : q
    );
    updateQuestions(updated);
  };

  // Trigger editing inline text
  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  // Save changes of edit text
  const saveEditedText = (id: string) => {
    if (!editingText.trim()) return;
    const updated = questions.map(q => 
      q.id === id ? { ...q, text: editingText.trim() } : q
    );
    updateQuestions(updated);
    setEditingId(null);
  };

  // Delete question
  const deleteQuestion = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    updateQuestions(updated);
  };

  // Add custom question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: ManageableQuestion = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      text: newQuestionText.trim(),
      pool: newQuestionPool,
      enabled: true
    };

    updateQuestions([newQ, ...questions]);
    setNewQuestionText('');
  };

  // Restore defaults
  const handleRestoreDefaults = () => {
    if (window.confirm("Are you sure you want to reset the deck to default questions? This will erase your custom added questions.")) {
      const defaults: ManageableQuestion[] = [
        ...GREEN_POOL.map((q, i) => ({ id: `green-${i}`, text: q.text, pool: 'green' as const, enabled: true })),
        ...YELLOW_POOL.map((q, i) => ({ id: `yellow-${i}`, text: q.text, pool: 'yellow' as const, enabled: true }))
      ];
      updateQuestions(defaults);
      setEditingId(null);
    }
  };

  // Filtered list based on search Input
  const filteredQuestions = questions.filter(q => 
    q.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enabledCount = questions.filter(q => q.enabled).length;

  return (
    <div className="w-full max-w-xl mx-auto py-2 px-1">
      <AnimatePresence mode="wait">
        
        {/* Step 1: Post-Round / Direct Selection Area */}
        {currentStep === 'post-round' && (
          <motion.div
            key="post-round"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-xl border border-line p-5 sm:p-7 text-center shadow-xs relative overflow-hidden"
          >
            {/* Direct Cards Navigation Options / Header Tab triggers */}
            {direct && (
              <div className="flex border-b border-line mb-6 font-mono text-[10px] uppercase tracking-wide">
                <button
                  type="button"
                  onClick={() => setSubView('draw')}
                  className={`flex-1 py-2.5 text-center font-bold border-b-2 transition-all cursor-pointer ${
                    subView === 'draw'
                      ? 'border-sage text-ink'
                      : 'border-transparent text-slate/60 hover:text-ink'
                  }`}
                >
                  🃏 Draw Intimacy Card
                </button>
                <button
                  type="button"
                  onClick={() => setSubView('manage')}
                  className={`flex-1 py-2.5 text-center font-bold border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    subView === 'manage'
                      ? 'border-sage text-ink'
                      : 'border-transparent text-slate/60 hover:text-ink'
                  }`}
                  id="tab-manage-deck"
                >
                  <Sliders className="w-3.5 h-3.5 text-sage" /> Deck Customizer ({enabledCount}/{questions.length})
                </button>
              </div>
            )}

            {subView === 'draw' ? (
              <>
                {/* Standard Draw View */}
                <div className="w-12 h-12 rounded-full bg-bg border border-line flex items-center justify-center mx-auto mb-4 relative">
                  {direct ? (
                    <BookOpen className="w-5 h-5 text-sage animate-pulse" />
                  ) : (
                    <Award className="w-5 h-5 text-sage animate-pulse" />
                  )}
                </div>

                <span className="text-[9px] font-bold tracking-widest text-[#4A5568]/60 uppercase block mb-1 font-mono">
                  {direct ? "Connection Cards Deck" : "Round Completed"}
                </span>
                
                {/* Winner Announcement Headline */}
                <h2 className="text-3xl font-serif text-ink font-normal italic tracking-tight mb-4">
                  {direct ? "Draw Intimacy Card" : (winner === 'tie' ? "An Amazing Tie!" : `${getWinnerName()} Won!`)}
                </h2>

                {/* Calm game summary card */}
                {!direct && (
                  <div className="bg-bg border border-line p-5 rounded-lg text-center mb-6 max-w-sm mx-auto relative group">
                    <span className="text-[9px] font-bold tracking-widest text-slate uppercase block font-mono mb-1">Round Review</span>
                    <p className="text-xs text-slate font-sans leading-relaxed mt-1">
                      {summary}
                    </p>
                  </div>
                )}

                {/* Draw Card Reward Flow trigger */}
                <div className="space-y-4">
                  <p className="text-[10px] text-slate font-mono uppercase tracking-wider leading-relaxed max-w-md mx-auto">
                    {direct
                      ? `We have active deck size of ${enabledCount} cards enabled. Tap below to draw a card randomly to explore.`
                      : (winner === 'tie' 
                        ? `Since it is a tie, either player can draw the question card. Active deck size: ${enabledCount}.`
                        : `Only the winner (${getWinnerName()}) should tap below to draw from ${enabledCount} active cards.`
                      )
                    }
                  </p>

                  <button
                    onClick={drawCard}
                    id="draw-question-btn"
                    className="w-full py-4 bg-slate hover:bg-ink text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Draw Intimacy Card
                  </button>

                  {direct && (
                    <button
                      onClick={onNextRound}
                      className="w-full py-1.5 text-slate hover:text-ink font-mono text-[9px] uppercase tracking-wider transition-all cursor-pointer underline decoration-line hover:decoration-sage"
                    >
                      ➔ Go Back to Games
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* DECK MANAGEMENT COMPONENT VIEW */
              <div className="text-left font-sans animate-fade-in">
                <div className="mb-4">
                  <h3 className="text-base font-serif font-normal italic text-ink">Deck Customizer</h3>
                  <p className="text-xs text-slate leading-relaxed mt-1">
                    Toggle checkboxes to show or hide questions from drawing. You can add custom questions, edit existing texts, or reset the list completely.
                  </p>
                </div>

                {/* Custom Question Entry Form */}
                <form onSubmit={handleAddQuestion} className="bg-bg border border-line p-4 rounded-lg mb-5 space-y-3">
                  <span className="text-[9px] font-bold tracking-widest text-slate uppercase font-mono block">Add New Question Card</span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="Write your beautiful deep question or clue..."
                      className="flex-1 bg-white border border-line rounded-md p-2 text-xs focus:outline-none focus:ring-1 focus:ring-sage focus:border-sage"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newQuestionPool}
                        onChange={(e) => setNewQuestionPool(e.target.value as 'green' | 'yellow')}
                        className="bg-white border border-line rounded-md px-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-sage"
                      >
                        <option value="green">🟢 Level 1</option>
                        <option value="yellow">🟡 Level 2</option>
                      </select>
                      <button
                        type="submit"
                        className="bg-slate hover:bg-ink text-white px-3.5 py-2 rounded-md text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add
                      </button>
                    </div>
                  </div>
                </form>

                {/* Search & Bulk Controls */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-4 pb-3 border-b border-line/40">
                  {/* Search input bar */}
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate/50" />
                    <input
                      type="text"
                      placeholder="Filter cards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-bg border border-line rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sage"
                    />
                  </div>

                  {/* Settings Action buttons */}
                  <div className="flex gap-2.5 w-full sm:w-auto items-center justify-between sm:justify-end">
                    <button
                      type="button"
                      onClick={handleRestoreDefaults}
                      className="text-[9px] font-mono text-amber hover:text-amber/80 uppercase font-bold tracking-wider underline cursor-pointer"
                    >
                      Reset to defaults
                    </button>
                    <span className="text-[10px] text-slate font-mono uppercase bg-bg p-1 px-2.5 rounded-md border border-line">
                      Selected: <strong>{enabledCount}</strong>/{questions.length}
                    </span>
                  </div>
                </div>

                {/* Question scrolling list container */}
                <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 border border-line/30 rounded-lg p-2 bg-stone-50/50">
                  {filteredQuestions.length === 0 ? (
                    <div className="text-center p-8 text-xs text-slate/60 italic">
                      No cards match your search criteria.
                    </div>
                  ) : (
                    filteredQuestions.map((q) => (
                      <div 
                        key={q.id}
                        className={`p-3 rounded-lg border bg-white flex gap-3 items-start justify-between transition-all ${
                          q.enabled 
                            ? 'border-line' 
                            : 'border-line/40 opacity-50 bg-stone-100/30'
                        }`}
                      >
                        {/* Left Checkbox */}
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={q.enabled}
                            onChange={() => toggleQuestionEnabled(q.id)}
                            className="w-4 h-4 rounded text-sage focus:ring-sage border-line cursor-pointer mt-0.5 shrink-0"
                            title={q.enabled ? "Enabled (click to hide)" : "Disabled (click to show)"}
                          />

                          {/* Editable Question Body */}
                          <div className="flex-1 min-w-0">
                            {editingId === q.id ? (
                              <div className="flex gap-1.5 w-full">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="flex-1 bg-white border border-line rounded-md p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sage font-serif italic text-ink"
                                  rows={2}
                                  autoFocus
                                />
                                <div className="flex flex-col gap-1">
                                  <button
                                    onClick={() => saveEditedText(q.id)}
                                    className="p-1.5 bg-sage text-white rounded hover:bg-sage/95 transition-all cursor-pointer"
                                    title="Save changes"
                                    type="button"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="p-1.5 bg-line text-slate hover:text-ink rounded transition-all cursor-pointer"
                                    title="Cancel"
                                    type="button"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p 
                                  className={`text-xs font-serif font-normal italic tracking-tight leading-relaxed text-ink ${
                                    !q.enabled ? 'line-through text-slate/50' : ''
                                  }`}
                                  onDoubleClick={() => startEditing(q.id, q.text)}
                                  title="Double click to edit text"
                                >
                                  {q.text}
                                </p>
                                
                                <span className={`text-[8px] font-mono font-bold tracking-wider uppercase inline-block mt-1 ${
                                  q.pool === 'green' ? 'text-sage' : 'text-amber'
                                }`}>
                                  {q.pool === 'green' ? '🟢 Level 1: Safe' : '🟡 Level 2: Gently Deep'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Actions */}
                        {editingId !== q.id && (
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              type="button"
                              onClick={() => startEditing(q.id, q.text)}
                              className="p-1 px-1.5 text-[9px] hover:bg-bg border border-transparent hover:border-line rounded text-slate hover:text-ink transition-all cursor-pointer flex items-center gap-0.5"
                              title="Edit item"
                            >
                              <Edit3 className="w-3 h-3 text-slate/80" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteQuestion(q.id)}
                              className="p-1 px-1.5 text-[9px] hover:bg-amber/5 border border-transparent hover:border-amber/20 rounded text-amber/60 hover:text-amber transition-all cursor-pointer flex items-center gap-0.5"
                              title="Remove card"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Toggle switch back option */}
                <div className="mt-5 pt-3 border-t border-line/40 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSubView('draw')}
                    className="py-1.5 px-4 bg-slate hover:bg-ink text-white font-semibold text-[10px] rounded-lg uppercase tracking-wider transition-all duration-150 cursor-pointer flex items-center gap-1 active:scale-98"
                  >
                    ➔ Back to drawing card
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Animating/Flipping Stage */}
        {currentStep === 'animating' && (
          <motion.div
            key="animating"
            initial={{ opacity: 0, rotateY: 0 }}
            animate={{ opacity: 1, rotateY: 180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="h-[340px] bg-bg rounded-xl border border-line shadow-xs flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-10 h-10 border-2 border-line border-t-sage rounded-full animate-spin"></div>
            <p className="text-[10px] font-mono font-bold text-slate uppercase tracking-widest mt-4">
              Shuffling cards...
            </p>
          </motion.div>
        )}

        {/* Step 3: Card Reveal Screen */}
        {currentStep === 'card-reveal' && drawnQuestion && (
          <motion.div
            key="card-reveal"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg rounded-xl border border-line p-6 sm:p-8 text-center shadow-xs relative overflow-hidden transition-all duration-300"
          >
            {/* Pool category pill indicator */}
            <div className="flex justify-center mb-6">
              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border font-mono ${
                drawnQuestion.pool === 'green'
                  ? 'bg-white border-line text-sage'
                  : 'bg-white border-line text-amber'
              }`}>
                {drawnQuestion.pool === 'green' ? '🟢 Level 1: Safe' : '🟡 Level 2: Gently Deep'}
              </span>
            </div>

            {/* Quote iconography */}
            <div className="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center mx-auto mb-6 shadow-xs">
              <Quote className="w-4 h-4 text-slate rotate-180" />
            </div>

            {/* Core Card Intimacy Question */}
            <blockquote className="my-6 block">
              <p className="text-2xl sm:text-3xl font-serif text-ink font-normal italic tracking-tight leading-snug px-3">
                {drawnQuestion.text}
              </p>
            </blockquote>

            {/* Loser instruction prompting banner */}
            <div className="mt-8 mb-6 p-4 bg-white rounded-lg border border-line max-w-sm mx-auto shadow-xs relative">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-bg border border-line text-[8px] font-bold text-sage uppercase tracking-widest flex items-center gap-1 font-mono">
                <Heart className="w-3 h-3 fill-bg text-sage" /> Connection Cue
              </div>
              
              <h4 className="text-sm font-serif font-semibold italic text-ink mt-1">
                {getLoserPrompt()}
              </h4>
              <p className="text-xs text-slate mt-1 leading-relaxed">
                {getLoserSubtext()}
              </p>
            </div>

            {/* Draw another / close deck choices */}
            <div className="flex flex-col sm:flex-row gap-3">
              {direct && (
                <button
                  onClick={() => {
                    setCurrentStep('post-round');
                    setDrawnQuestion(null);
                  }}
                  className="flex-1 py-4 bg-white hover:bg-bg border border-line text-slate hover:text-ink font-semibold text-xs rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Draw Another
                </button>
              )}
              <button
                onClick={onNextRound}
                id="next-round-btn"
                className={`py-4 ${direct ? 'flex-1' : 'w-full'} bg-slate hover:bg-ink text-white font-semibold text-xs rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98`}
              >
                {direct ? 'Back to Menu' : 'Close & Next Round'} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

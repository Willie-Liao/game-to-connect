export interface Question {
  text: string;
  pool: 'green' | 'yellow';
}

export const GREEN_POOL: Question[] = [
  { text: "Describe something that's exciting in your life right now.", pool: 'green' },
  { text: "Tell me something you believed as a child that makes you laugh now.", pool: 'green' },
  { text: "What's something frivolous that you don't mind spending money on?", pool: 'green' },
  { text: "What was your first impression of me?", pool: 'green' },
  { text: "Which personal accomplishment are you most proud of? Why?", pool: 'green' },
  { text: "What are the top five qualities you admire about me?", pool: 'green' },
  { text: "How do you describe me to other people?", pool: 'green' },
  { text: "What book do you believe I would benefit most from reading?", pool: 'green' }
];

export const YELLOW_POOL: Question[] = [
  { text: "How do you like to be cared for when you're ill?", pool: 'yellow' },
  { text: "How do you like to be comforted when you feel down?", pool: 'yellow' },
  { text: "What's your favorite way to receive affection?", pool: 'yellow' },
  { text: "How do we work well together and balance each other out? Explain.", pool: 'yellow' },
  { text: "Tell me two things I can do to better support you.", pool: 'yellow' },
  { text: "Which couple in our life do you wish to be either more like or nothing like? Explain.", pool: 'yellow' },
  { text: "What did you learn about money from your parents?", pool: 'yellow' }
];

export interface UnscrambleWord {
  word: string;
  scrambled: string;
  hint: string;
}

/** First letter stays put; remaining letters keep their order, rotated once. */
export function scrambleKeepingFirstLetter(word: string): string {
  if (word.length <= 2) return word;

  const first = word[0];
  const rest = word.slice(1);

  let seed = 0;
  for (let i = 0; i < word.length; i++) {
    seed = (seed + word.charCodeAt(i) * (i + 1)) % 100000;
  }

  const maxShift = rest.length - 1;
  const shift = maxShift === 0 ? 0 : (seed % maxShift) + 1;
  const rotated = rest.slice(shift) + rest.slice(0, shift);

  return first + rotated;
}

export const UNSCRAMBLE_WORDS: UnscrambleWord[] = [
  { word: "INTIMACY", scrambled: "IYNTIMAC", hint: "A state of close familiarity or friendship; closeness." },
  { word: "CONNECTION", scrambled: "CIONONNECT", hint: "A relationship in which a person, thing, or idea is linked." },
  { word: "VULNERABILITY", scrambled: "VBILITYULNERA", hint: "The quality of being open to emotional exposure or risk." },
  { word: "COMPASSION", scrambled: "CNOMPASSIO", hint: "Sympathy and concern for the sufferings or misfortunes of others." },
  { word: "BOUNDLESS", scrambled: "BDLESSOUN", hint: "Having no bounds; infinite and unlimited." },
  { word: "EMPATHY", scrambled: "EHYMPAT", hint: "The ability to understand and share the feelings of another." },
  { word: "AFFECTION", scrambled: "AECTIONFF", hint: "A gentle feeling of fondness or liking." },
  { word: "LAUGHTER", scrambled: "LUGHTERA", hint: "The action or sound of laughing, reflecting shared joy." },
  { word: "HEARTFELT", scrambled: "HELTEARTF", hint: "Sincere and deeply felt connection." },
  { word: "CLOSENESS", scrambled: "CENESSLOS", hint: "The quality of being warm, intimate, or physically near." },
  { word: "CHERISH", scrambled: "CSHHERI", hint: "Protect and care for someone lovingly." },
  { word: "SUPPORT", scrambled: "SRTUPPO", hint: "Give assistance, encouragement, or approval to." },
  { word: "KINDNESS", scrambled: "KSSINDNE", hint: "Being friendly, generous, and considerate toward someone." },
  { word: "WARMTH", scrambled: "WHARMT", hint: "A gentle, comforting heat—often how safe closeness feels." },
  { word: "TOGETHER", scrambled: "TEROGETH", hint: "With each other; side by side, not apart." },
  { word: "GRATITUDE", scrambled: "GATITUDER", hint: "Thankfulness and appreciation for what you share." },
  { word: "PATIENCE", scrambled: "PENCEATI", hint: "The capacity to wait calmly without rushing the other person." },
  { word: "LOYALTY", scrambled: "LTYOYAL", hint: "Steadfast faithfulness and standing by someone." },
  { word: "COURAGE", scrambled: "CAGEOUR", hint: "Bravery to be honest, vulnerable, or try something new together." },
  { word: "DEVOTION", scrambled: "DOTIONEV", hint: "Deep love, loyalty, and commitment to someone." },
  { word: "TENDERNESS", scrambled: "TNDERNESSE", hint: "Gentle, soft care in words, touch, or attention." },
  { word: "TRUST", scrambled: "TSTRU", hint: "Confidence that someone is safe, honest, and on your side." },
  { word: "COMFORT", scrambled: "CFORTOM", hint: "Ease and relief found in someone's presence or care." },
  { word: "PROMISE", scrambled: "POMISER", hint: "A commitment you make and intend to keep." },
  { word: "MEMORY", scrambled: "MRYEMO", hint: "A moment you hold onto and revisit together." },
  { word: "GENTLE", scrambled: "GTLEEN", hint: "Soft, careful, and never harsh in how you show up." },
  { word: "OPENNESS", scrambled: "OSPENNES", hint: "Willingness to share honestly without hiding behind walls." },
  { word: "HARMONY", scrambled: "HONYARM", hint: "When you fit together smoothly, even through differences." },
  { word: "PLAYFUL", scrambled: "PAYFULL", hint: "Light, fun energy that keeps things from feeling too serious." },
  { word: "WHISPER", scrambled: "WISPERH", hint: "A quiet, close voice meant for only one listener." },
  { word: "SUNSHINE", scrambled: "SINEUNSH", hint: "Bright warmth—like the mood someone brings into your day." },
  { word: "ADVENTURE", scrambled: "AENTUREDV", hint: "A shared experience that feels new, exciting, or a little daring." },
  { word: "REASSURE", scrambled: "RSUREEAS", hint: "To calm someone's worries and help them feel safe again." },
  { word: "FOREVER", scrambled: "FEROREV", hint: "For all the time ahead—often said about love or commitment." },
  { word: "UNDERSTAND", scrambled: "UDNDERSTAN", hint: "To truly grasp how someone feels, not just hear their words." },
];

export const FEIHUALING_CHAR_POOL = [
  "花", "雨", "月", "山", "风", "春", "夜", "酒", "云", "水", "雪", "江", "海", "星", "日",
  "秋", "夏", "冬", "竹", "松", "梅", "霜", "露", "溪", "湖", "舟", "草", "叶", "石", "天", "心"
];

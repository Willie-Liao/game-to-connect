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

export const UNSCRAMBLE_WORDS: UnscrambleWord[] = [
  { word: "INTIMACY", scrambled: "YTTIINMCA", hint: "A state of close familiarity or friendship; closeness." },
  { word: "CONNECTION", scrambled: "NNCOOETICN", hint: "A relationship in which a person, thing, or idea is linked." },
  { word: "VULNERABILITY", scrambled: "YTLIBARENLUV", hint: "The quality of being open to emotional exposure or risk." },
  { word: "COMPASSION", scrambled: "PISMNCOASO", hint: "Sympathy and concern for the sufferings or misfortunes of others." },
  { word: "BOUNDLESS", scrambled: "NESLDUSBO", hint: "Having no bounds; infinite and unlimited." },
  { word: "EMPATHY", scrambled: "AYMPEHT", hint: "The ability to understand and share the feelings of another." },
  { word: "AFFECTION", scrambled: "FOFITENCA", hint: "A gentle feeling of fondness or liking." },
  { word: "LAUGHTER", scrambled: "UTHALGER", hint: "The action or sound of laughing, reflecting shared joy." },
  { text: "HEARTFELT", word: "HEARTFELT", scrambled: "TFRAEHLTE", hint: "Sincere and deeply felt connection." },
  { word: "CLOSENESS", scrambled: "SSESOLENC", hint: "The quality of being warm, intimate, or physically near." },
  { word: "CHERISH", scrambled: "HREIHCS", hint: "Protect and care for someone lovingly." },
  { word: "SUPPORT", scrambled: "PROSTUP", hint: "Give assistance, encouragement, or approval to." }
].map(item => ({
  word: item.word,
  scrambled: item.scrambled,
  hint: item.hint
}));

export const FEIHUALING_CHAR_POOL = [
  "花", "雨", "月", "山", "风", "春", "夜", "酒", "云", "水", "雪", "江", "海", "星", "日", 
  "秋", "夏", "冬", "竹", "松", "梅", "霜", "露", "溪", "湖", "舟", "草", "叶", "石", "天"
];

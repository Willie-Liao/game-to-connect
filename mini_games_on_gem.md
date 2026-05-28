Act as an expert Frontend Engineer and UI/UX Designer. Build a fully functional, self-contained interactive web application prototype for a couples' connection game. 

### Core Concept:
The app helps two people build closeness through **lightweight, low-pressure mini-games**—quick rounds with minimal rules, no quizzes, and no heavy scoring mechanics beyond the shared win counter. Each mini-game round ends with a clear winner. The **winner** draws a safe, curated question from the intimacy card deck; the **loser** answers it aloud. The design must feel premium, intimate, and emotionally safe, completely avoiding any "test" or "interrogation" vibes.

### Technical Requirements:
1. Single-file output: Deliver the entire application inside a single HTML block containing all embedded CSS (<style>) and vanilla JavaScript (<script>).
2. No external dependencies: Use pure CSS and standard web APIs. Do not rely on external frameworks or CDNs.
3. Mobile-First & Responsive: The layout must look beautiful on both mobile screens (large, touch-friendly tap targets) and desktop viewports.

### UI/UX Design Specifications:
- Aesthetic: Minimalist, clean, and elegant (inspired by modern card decks like "We're Not Really Strangers").
- Color Palette: Soft, warm neutrals. Use a light background (cream or soft off-white), slate tones for typography, and subtle, elegant accents for categories (e.g., a muted sage green for safe cards, a soft amber for deeper cards).
- Components needed:
  * A persistent Scoreboard at the top tracking wins for "You" and "Her".
  * A Main Menu panel showing four game options.
  * Dynamically rendered Game Zones that switch smoothly without page reloads.
  * A **Post-Round** state after each game: show who won the round, then a prominent **center "Draw Question"** button (only meaningful for the round winner—see Reward flow below).
  * A high-impact **Card Reveal** state that displays the drawn question beautifully after the winner taps Draw; copy should cue the loser to answer (e.g. “Her answers” / “You answer”).

### Data & Content Architecture (Hardcoded in JS):

1. GREEN POOL (Safe, positive, nostalgic):
   - "Describe something that's exciting in your life right now."
   - "Tell me something you believed as a child that makes you laugh now."
   - "What's something frivolous that you don't mind spending money on?"
   - "What was your first impression of me?"
   - "Which personal accomplishment are you most proud of? Why?"
   - "What are the top five qualities you admire about me?"
   - "How do you describe me to other people?"
   - "What book do you believe I would benefit most from reading?"

2. YELLOW POOL (Gently deep, operational comfort):
   - "How do you like to be cared for when you're ill?"
   - "How do you like to be comforted when you feel down?"
   - "What's your favorite way to receive affection?"
   - "How do we work well together and balance each other out? Explain."
   - "Tell me two things I can do to better support you."
   - "Which couple in our life do you wish to be either more like or nothing like? Explain."
   - "What did you learn about money from your parents?"

3. FEIHUALING_CHAR_POOL (飞花令 — nature / material characters common in poetry):
   - 花, 雨, 月, 山, 风, 春, 夜, 酒, 云, 水, 雪, 江, 海, 星, 日, 秋, 夏, 冬, 竹, 松, 梅, 霜, 露, 溪, 湖, 舟, 草, 叶, 石, 天

### App Logic & Mini-Games:
- Game 1: The Mind-Reader -> The app secretly selects a number between 30 and 70. Both players input a guess. The closest player wins.

- Game 2: Split-Second Strike (Simultaneous Precision Timing) 
  * How it works: The app displays a random target time dynamically generated between 8.00 and 15.00 seconds. 
  * The screen layout splits into two large, distinct tap areas: one labeled "You" and one labeled "Her".
  * A central visual timer counts up from 0.00. To maximize the challenge, the visual numbers completely disappear 2 seconds before the target time is reached, forcing both players to count the final seconds using their internal clock.
  * Both players must tap their respective zone as close to the target time as possible. 
  * The app captures both timestamps down to the millisecond, displays both scores to show who was closer to the exact target, and automatically awards the win to the closest player.

- Game 3: Word Unscramble -> Presents a scrambled version of relationship/connection words (e.g., "YTTIINMCA" for Intimacy). First to solve wins.

- Game 4: 飞花令 (Feihualing — “Flying Flower” verse chain)
  * Cultural reference: A classic Chinese literary parlor game. Players take turns (or race) to say or write a line that **contains a given Chinese character**, often one that appears frequently in poetry and names something tangible in the natural world (material existence): e.g. 花 (flower), 雨 (rain), 月 (moon), 山 (mountain), 风 (wind), 春 (spring), 夜 (night), 酒 (wine).
  * Lightweight couples version (keep it playful, not academic):
    - The app randomly draws one character from the hardcoded `FEIHUALING_CHAR_POOL` (all nature/material-themed as above).
    - Display the character large and centered, with a one-line hint: “Say or type any line—poem, lyric, or your own—that includes this character.”
    - Split layout: “You” and “Her” each get a text field and a **Submit** button (same pattern as other games).
    - **Win rule:** First valid submission wins. A submission is valid if the text contains the target character at least once (simple string includes check; trim whitespace). No poetry database or AI grading in v1.
    - If both submit before either is judged, compare timestamps; earliest valid submit wins. Invalid submit (missing character) shows a gentle inline error and lets that player try again until the other wins or also submits.
    - Optional soft timer (e.g. 45s) per round; if it expires with no winner, offer “Pass / Try another character” to reshuffle—never punish or shame.
  * Tone: Celebrate effort and shared culture; lines can be famous verses, song lyrics, or silly improvised couplets. The goal is laughter and connection, not a literature exam.

### Round Outcome & Reward Flow (every mini-game):
1. **Decide the winner for this round only** — each game’s rules determine win/loss/tie for that single round (no multi-round bracket inside one game session).
2. **Post-Round screen:** Announce the round winner by name (“You” or “Her”), increment that player’s win count on the scoreboard, and show a calm summary (e.g. times, guesses, or winning line for 飞花令). Do **not** auto-draw a card.
3. **Draw Question (winner’s action):** Display a large, centered **“Draw Question”** button between the two player zones (or centered below the result). Only the **round winner** should tap it to reveal a card—losers do not draw. If helpful for shared phones, the button is tappable by either hand, but the UI copy makes clear the winner is drawing for the pair.
4. **Card reveal:** On tap, pick one question at random (60% Green Pool, 40% Yellow Pool) and transition to the Card Reveal state. Show the question prominently and a clear line such as **“[Loser] answers”** (dynamic label based on who lost the round). The winner listens; there is no requirement for the winner to answer unless they choose to chat naturally.
5. **Next Round:** Provide a **“Next Round”** button on the card screen that dismisses the question, resets game inputs/state, and returns to the Main Menu so they can pick another mini-game or replay the same one.
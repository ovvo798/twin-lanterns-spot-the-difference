// Every tuning number and layout constant in one place. The playfield is a fixed
// 1280x720 logical area; the renderer scales it to the window, so no rule below
// depends on the screen size.

export const FIELD = { width: 1280, height: 720 };

/** The two picture panels, in logical coordinates. */
export const PANELS = {
  width: 608,
  height: 560,
  y: 76,
  leftX: 16,
  rightX: 656,
};

/** Header strip and bottom bar, in logical coordinates. */
export const HEADER = { height: 64 };
export const FOOTER = { y: 648, height: 72 };

/** The clickable hint button in the bottom bar, in logical coordinates. */
export const HINT_BUTTON = { x: 16, y: 656, width: 200, height: 48 };

/** The simulation's fixed step, in seconds: 60 updates a second whatever the display's rate. */
export const STEP = 1 / 60;

/** Scoring: a find, a streak bonus per find in a row, a wrong click, a hint, a round-clear bonus. */
export const SCORE = {
  find: 100,
  streakBonus: 15,
  wrong: -15,
  hint: -50,
  clearPerSecond: 5,
};

/** A wrong click also costs seconds off the clock. */
export const WRONG_TIME_COST = 3;

/** Hints per round, seconds between hints, seconds a hint ring pulses. */
export const HINT = { perRound: 3, cooldown: 8, pulse: 2.5 };

/** How fast the keyboard crosshair travels, logical pixels per second. */
export const CROSSHAIR_SPEED = 340;

/** How long a wrong-click red X stays on the panel, in seconds. */
export const WRONG_FLASH = 0.9;

/** How long the bottom message line shows a note, in seconds. */
export const MESSAGE_TIME = 2.6;

export const PALETTE = {
  backdrop: '#17130e',
  header: '#221b12',
  panelFrame: '#3a2f1d',
  panelTag: '#f2c94c',
  text: '#f5efe2',
  muted: '#b8a98d',
  accent: '#7ec850',
  found: '#58c96b',
  wrong: '#e5534b',
  hint: '#ffb020',
  timer: '#f2c94c',
  timerLow: '#e5534b',
  button: '#2e4a2a',
  buttonEdge: '#7ec850',
  overlay: 'rgba(12, 9, 5, 0.82)',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'twin-lanterns.best';

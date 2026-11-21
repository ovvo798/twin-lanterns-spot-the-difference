// The game's rules and state, with no drawing and no browser in it: which round
// is on, what is found, the clock, the score, hints and the keyboard crosshair.
// tick() advances one fixed step; the caller renders whatever state is here.
import { HINT, MESSAGE_TIME, PANELS, SCORE, WRONG_FLASH, WRONG_TIME_COST } from './config.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_CLEAR = 'roundClear';
export const SCREEN_OVER = 'gameOver';
export const SCREEN_WIN = 'victory';

export function createGame(scenes) {
  const game = {
    scenes,
    screen: SCREEN_TITLE,
    roundIndex: 0,
    found: new Set(),
    foundTotal: 0,
    timeLeft: scenes[0].timeLimit,
    score: 0,
    streak: 0,
    mistakes: 0,
    hintsLeft: HINT.perRound,
    hintCooldown: 0,
    hint: null,
    wrongFlash: null,
    message: '',
    messageUntil: 0,
    now: 0,
    crosshair: { panel: 0, x: PANELS.width / 2, y: PANELS.height / 2 },
    showCrosshair: true,
    roundClearInfo: null,
    gameOverReason: null,
  };

  function scene() {
    return scenes[game.roundIndex];
  }

  function remaining() {
    return scene().diffs.length - game.found.size;
  }

  function say(text) {
    game.message = text;
    game.messageUntil = game.now + MESSAGE_TIME;
  }

  function startRound(index) {
    game.roundIndex = index;
    game.found = new Set();
    game.timeLeft = scene().timeLimit;
    game.hintsLeft = HINT.perRound;
    game.hintCooldown = 0;
    game.hint = null;
    game.wrongFlash = null;
    game.streak = 0;
    game.roundClearInfo = null;
    game.gameOverReason = null;
    game.crosshair = { panel: 0, x: PANELS.width / 2, y: PANELS.height / 2 };
    game.screen = SCREEN_PLAY;
    say(`${scene().name} — find ${scene().diffs.length} differences!`);
  }

  function start() {
    game.score = 0;
    game.foundTotal = 0;
    game.mistakes = 0;
    startRound(0);
  }

  function nearestDiff(x, y) {
    let best = null;
    let bestDistance = Infinity;
    for (const diff of scene().diffs) {
      const d = Math.hypot(diff.x - x, diff.y - y);
      if (d < bestDistance) {
        bestDistance = d;
        best = diff;
      }
    }
    return bestDistance <= best.r + 8 ? best : null;
  }

  /** Test a click at panel coordinates. Returns 'found', 'already', 'wrong' or 'none'. */
  function checkAt(panel, x, y) {
    if (game.screen !== SCREEN_PLAY) return 'none';
    const diff = nearestDiff(x, y);
    if (diff === null) {
      game.streak = 0;
      game.mistakes += 1;
      game.score = Math.max(0, game.score + SCORE.wrong);
      game.timeLeft = Math.max(0, game.timeLeft - WRONG_TIME_COST);
      game.wrongFlash = { panel, x, y, until: game.now + WRONG_FLASH };
      say(`Not there — ${WRONG_TIME_COST} seconds lost!`);
      return 'wrong';
    }
    if (game.found.has(diff.id)) {
      say('Already found that one.');
      return 'already';
    }
    game.found.add(diff.id);
    game.foundTotal += 1;
    const gained = SCORE.find + game.streak * SCORE.streakBonus;
    game.score += gained;
    game.streak += 1;
    if (remaining() === 0) {
      const bonus = Math.ceil(game.timeLeft) * SCORE.clearPerSecond;
      game.score += bonus;
      game.roundClearInfo = { bonus, secondsLeft: Math.ceil(game.timeLeft) };
      game.screen = SCREEN_CLEAR;
      say(`Round clear! Time bonus +${bonus}.`);
    } else {
      say(`Found: ${diff.label}! ${remaining()} to go.`);
    }
    return 'found';
  }

  /** Spend a hint: ring one unfound difference for a few seconds. Returns it or null. */
  function useHint() {
    if (game.screen !== SCREEN_PLAY) return null;
    if (game.hintsLeft <= 0) {
      say('No hints left this round.');
      return null;
    }
    if (game.hintCooldown > 0) {
      say(`Hint recharging — ${Math.ceil(game.hintCooldown)}s.`);
      return null;
    }
    const unfound = scene().diffs.filter((d) => !game.found.has(d.id));
    if (unfound.length === 0) return null;
    const diff = unfound[Math.floor(Math.random() * unfound.length)];
    game.hintsLeft -= 1;
    game.hintCooldown = HINT.cooldown;
    game.score = Math.max(0, game.score + SCORE.hint);
    game.hint = { diffId: diff.id, until: game.now + HINT.pulse };
    say(`Hint: look for ${diff.label.toLowerCase()}…`);
    return diff;
  }

  /** One fixed step: the clock, the hint cooldown and the hint ring. */
  function tick(dt) {
    game.now += dt;
    if (game.screen !== SCREEN_PLAY) return;
    game.timeLeft -= dt;
    if (game.hintCooldown > 0) game.hintCooldown = Math.max(0, game.hintCooldown - dt);
    if (game.hint && game.now >= game.hint.until) game.hint = null;
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      game.gameOverReason = 'time';
      game.screen = SCREEN_OVER;
      say('Out of time!');
    }
  }

  function nextRound() {
    if (game.roundIndex + 1 < scenes.length) startRound(game.roundIndex + 1);
    else game.screen = SCREEN_WIN;
  }

  function retryRound() {
    startRound(game.roundIndex);
  }

  function pause() {
    if (game.screen === SCREEN_PLAY) game.screen = SCREEN_PAUSED;
  }

  function resume() {
    if (game.screen === SCREEN_PAUSED) game.screen = SCREEN_PLAY;
  }

  function toTitle() {
    game.screen = SCREEN_TITLE;
  }

  function moveCrosshair(dx, dy, dt) {
    const speed = 340;
    const c = game.crosshair;
    c.x = Math.min(PANELS.width - 4, Math.max(4, c.x + dx * speed * dt));
    c.y = Math.min(PANELS.height - 4, Math.max(4, c.y + dy * speed * dt));
  }

  function switchCrosshairPanel() {
    game.crosshair.panel = game.crosshair.panel === 0 ? 1 : 0;
  }

  function checkCrosshair() {
    const c = game.crosshair;
    return checkAt(c.panel, c.x, c.y);
  }

  // Attach the rules to the state itself and hand that back, so the renderer
  // always reads the live screen, clock and found set — never a stale copy.
  Object.assign(game, {
    scene,
    remaining,
    start,
    startRound,
    checkAt,
    useHint,
    tick,
    nextRound,
    retryRound,
    pause,
    resume,
    toTitle,
    moveCrosshair,
    switchCrosshairPanel,
    checkCrosshair,
    say,
  });
  return game;
}

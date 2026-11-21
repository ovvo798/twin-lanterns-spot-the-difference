// The screenshot scenes behind ?shot=cover|play|harbor|hint. Each one sets the
// real game to a mid-round state — some differences already found and ringed,
// several still unfound, the counter and the clock showing — so the frame is what
// a real game looks like a few finds in, and the same name always gives the same frame.
import { SCREEN_PLAY } from './rounds.js';

function stage(name, game, roundIndex, foundCount, timeLeft, score, hintId) {
  game.start();
  game.startRound(roundIndex);
  const diffs = game.scene().diffs;
  for (let i = 0; i < foundCount && i < diffs.length; i += 1) {
    game.found.add(diffs[i].id);
    game.foundTotal += 1;
  }
  game.timeLeft = timeLeft;
  game.score = score;
  game.showCrosshair = false;
  game.message = '';
  game.messageUntil = 0;
  game.screen = SCREEN_PLAY;
  if (hintId) {
    const diff = diffs.find((d) => d.id === hintId);
    if (diff) game.hint = { diffId: diff.id, until: game.now + 3600 };
  }
}

/**
 * Set `game` to the named scene and return the best score to show.
 * cover: Lantern Night, 3 of 7 found. play: Sunny Garden, 2 of 5 found.
 * harbor: Harbour Morning, 4 of 9 found. hint: Sunny Garden, 2 found, hint ringing.
 */
export function stageShot(name, game) {
  if (name === 'play') {
    stage(name, game, 0, 2, 142, 210, null);
  } else if (name === 'harbor') {
    stage(name, game, 2, 4, 78, 560, null);
  } else if (name === 'hint') {
    stage(name, game, 0, 2, 150, 165, 'duck');
    game.hintsLeft = 2;
    game.hintCooldown = 6;
  } else {
    stage(name, game, 1, 3, 96, 340, null);
  }
  return { best: 1240 };
}

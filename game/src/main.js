// Boot and the one loop: the crosshair is steered every frame, the clock advances
// in fixed 1/60 s steps, and the renderer paints what is there. The game moves
// between six screens: title, play, paused, round clear, game over and victory.
//
// ?shot=cover|play|harbor|hint (with &seed=N) stages that scene instead of running
// the loop, paints it twice and sets window.__shotReady for a screenshot.
import { BEST_KEY, STEP } from './config.js';
import { SCENES } from '../scenes/index.js';
import { createGame, SCREEN_CLEAR, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './rounds.js';
import { createAudio } from './audio.js';
import { createInput } from './input.js';
import { createRenderer } from './render.js';
import { stageShot } from './shots.js';

/** The longest frame the loop catches up on; a longer stall (a hidden tab) is dropped, not replayed. */
const MAX_FRAME = 0.25;

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const game = createGame(SCENES);
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best score then lasts this visit only.
  }
}

function runShot(name) {
  const staged = stageShot(name, game);
  let painted = 0;
  function paint() {
    renderer.draw(game, staged.best, audio.isMuted());
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  }
  requestAnimationFrame(paint);
}

function runGame() {
  const input = createInput(canvas, {
    onGesture() {
      audio.unlock();
    },
    onConfirm() {
      audio.unlock();
      if (game.screen === SCREEN_TITLE) {
        game.start();
        announce('Playing. Find the differences.');
      } else if (game.screen === SCREEN_CLEAR) {
        game.nextRound();
        announce(game.screen === SCREEN_WIN ? 'Victory!' : 'Next round.');
      } else if (game.screen === SCREEN_OVER) {
        game.retryRound();
        announce('Round restarted.');
      } else if (game.screen === SCREEN_WIN) {
        game.start();
        announce('Playing again.');
      } else if (game.screen === SCREEN_PAUSED) {
        game.resume();
        announce('Playing.');
      } else if (game.screen === SCREEN_PLAY) {
        const result = game.checkCrosshair();
        if (result === 'found') audio.find();
        else if (result === 'wrong') audio.wrong();
      }
    },
    onPanelClick(panel, x, y) {
      audio.unlock();
      if (game.screen !== SCREEN_PLAY) {
        // A click anywhere on an overlay screen counts as its confirm.
        if (game.screen === SCREEN_TITLE) game.start();
        else if (game.screen === SCREEN_CLEAR) game.nextRound();
        else if (game.screen === SCREEN_OVER) game.retryRound();
        else if (game.screen === SCREEN_WIN) game.start();
        else if (game.screen === SCREEN_PAUSED) game.resume();
        return;
      }
      const result = game.checkAt(panel, x, y);
      if (result === 'found') audio.find();
      else if (result === 'wrong') audio.wrong();
    },
    onHint() {
      audio.unlock();
      if (game.useHint() !== null) audio.hint();
    },
    onPause() {
      if (game.screen === SCREEN_PLAY) {
        game.pause();
        announce('Paused.');
      } else if (game.screen === SCREEN_PAUSED) {
        game.resume();
        announce('Playing.');
      }
    },
    onMute() {
      const muted = audio.toggleMute();
      announce(muted ? 'Sound off.' : 'Sound on.');
    },
    onPanelSwitch() {
      game.switchCrosshairPanel();
    },
  });

  let best = readBest();
  let lastScreen = game.screen;
  let lastMessage = '';
  let accumulator = 0;
  let last = performance.now();

  // Screen readers (and anyone watching the page's text) hear the screen changes and each find.
  function announce(message) {
    status.textContent = message;
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, MAX_FRAME);
    last = now;

    if (game.screen === SCREEN_PLAY) {
      const dir = input.direction();
      if (dir.x !== 0 || dir.y !== 0) game.moveCrosshair(dir.x, dir.y, dt);
      accumulator += dt;
      while (accumulator >= STEP && game.screen === SCREEN_PLAY) {
        game.tick(STEP);
        accumulator -= STEP;
      }
    } else {
      accumulator = 0;
    }

    if (game.screen !== lastScreen) {
      if (game.screen === SCREEN_CLEAR) audio.clear();
      else if (game.screen === SCREEN_OVER) audio.over();
      else if (game.screen === SCREEN_WIN) audio.clear();
      if ((game.screen === SCREEN_OVER || game.screen === SCREEN_WIN) && game.score > best) {
        best = game.score;
        saveBest(best);
      }
      lastScreen = game.screen;
    }
    if (game.message !== lastMessage) {
      lastMessage = game.message;
      if (game.message) announce(`${game.message} Score ${game.score}.`);
    }

    renderer.draw(game, best, audio.isMuted());
  }

  // Leaving the tab pauses a running game rather than letting the clock run unseen.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && game.screen === SCREEN_PLAY) {
      game.pause();
      announce('Paused.');
    }
  });

  announce('Twin Lanterns. Press Space or click to start.');
  requestAnimationFrame(frame);
}

if (shot) runShot(shot);
else runGame();

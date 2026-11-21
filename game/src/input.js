// Keyboard and pointer input. Held arrow keys steer the crosshair; one-shot presses
// (confirm, hint, pause, mute, switch panel) call their hook once, so a press
// between two frames is never lost and never counted twice. A click on a picture
// is turned into panel coordinates and handed to the game.
import { FIELD, HINT_BUTTON, PANELS } from './config.js';

const LEFT = new Set(['ArrowLeft', 'KeyA']);
const RIGHT = new Set(['ArrowRight', 'KeyD']);
const UP = new Set(['ArrowUp', 'KeyW']);
const DOWN = new Set(['ArrowDown', 'KeyS']);
const CONFIRM = new Set(['Space', 'Enter']);
const PAUSE = new Set(['KeyP', 'Escape']);

function inRect(x, y, rect) {
  return x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height;
}

export function createInput(canvas, hooks) {
  const held = new Set();

  /** Client pixels to logical field coordinates (the renderer scales the field to fit). */
  function toLogical(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(rect.width / FIELD.width, rect.height / FIELD.height);
    const ox = (rect.width - FIELD.width * scale) / 2;
    const oy = (rect.height - FIELD.height * scale) / 2;
    return { x: (clientX - rect.left - ox) / scale, y: (clientY - rect.top - oy) / scale };
  }

  function panelAt(logical) {
    if (logical.y < PANELS.y || logical.y >= PANELS.y + PANELS.height) return null;
    if (logical.x >= PANELS.leftX && logical.x < PANELS.leftX + PANELS.width) {
      return { panel: 0, x: logical.x - PANELS.leftX, y: logical.y - PANELS.y };
    }
    if (logical.x >= PANELS.rightX && logical.x < PANELS.rightX + PANELS.width) {
      return { panel: 1, x: logical.x - PANELS.rightX, y: logical.y - PANELS.y };
    }
    return null;
  }

  window.addEventListener('keydown', (event) => {
    if (LEFT.has(event.code) || RIGHT.has(event.code) || UP.has(event.code) || DOWN.has(event.code)) {
      held.add(event.code);
      event.preventDefault();
      return;
    }
    if (event.repeat) return;
    if (CONFIRM.has(event.code)) {
      hooks.onConfirm();
      event.preventDefault();
    } else if (event.code === 'KeyH') {
      hooks.onHint();
    } else if (PAUSE.has(event.code)) {
      hooks.onPause();
    } else if (event.code === 'KeyM') {
      hooks.onMute();
    } else if (event.code === 'Tab') {
      hooks.onPanelSwitch();
      event.preventDefault();
    }
  });
  window.addEventListener('keyup', (event) => {
    held.delete(event.code);
  });
  // A key released while the tab is hidden never sends keyup: let go of everything on blur.
  window.addEventListener('blur', () => {
    held.clear();
  });

  canvas.addEventListener('pointerdown', (event) => {
    hooks.onGesture();
    const logical = toLogical(event.clientX, event.clientY);
    const hit = panelAt(logical);
    if (hit !== null) {
      hooks.onPanelClick(hit.panel, hit.x, hit.y);
      return;
    }
    if (inRect(logical.x, logical.y, HINT_BUTTON)) {
      hooks.onHint();
      return;
    }
    hooks.onConfirm();
  });

  return {
    /** Held steering as {x, y}, each -1, 0 or 1. */
    direction() {
      let x = 0;
      let y = 0;
      for (const code of held) {
        if (LEFT.has(code)) x -= 1;
        else if (RIGHT.has(code)) x += 1;
        else if (UP.has(code)) y -= 1;
        else if (DOWN.has(code)) y += 1;
      }
      return { x: Math.max(-1, Math.min(1, x)), y: Math.max(-1, Math.min(1, y)) };
    },
  };
}

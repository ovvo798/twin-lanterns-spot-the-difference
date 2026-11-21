// Drawing only: the game's state in, pixels out. The 1280x720 playfield is scaled
// to fit the window and centred, the margin filled with the backdrop colour. Each
// scene paints its two pictures; this file adds the frame around them: the header
// with its counter and timer, the found markers, the hint ring, the crosshair,
// the footer and the title / pause / clear / over / victory panels.
import { FIELD, FONT, FOOTER, HEADER, HINT, HINT_BUTTON, PALETTE, PANELS } from './config.js';
import { createRandom } from './random.js';
import { SCREEN_CLEAR, SCREEN_OVER, SCREEN_PAUSED, SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './rounds.js';
import { roundRectPath } from './helpers.js';

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };
  const fonts = new Map();

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * ratio);
    const height = Math.round(window.innerHeight * ratio);
    canvas.width = width;
    canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2;
    view.y = (height - FIELD.height * view.scale) / 2;
  }

  function text(value, x, y, size, color, align, weight) {
    const key = `${weight || ''}${size}`;
    if (!fonts.has(key)) fonts.set(key, `${weight || ''} ${size}px ${FONT}`);
    ctx.font = fonts.get(key);
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(value, x, y);
  }

  function clock(seconds) {
    const s = Math.max(0, Math.ceil(seconds));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function drawPanels(game) {
    const scene = game.scene();
    const sides = [
      { x: PANELS.leftX, side: 0, tag: 'LEFT' },
      { x: PANELS.rightX, side: 1, tag: 'RIGHT' },
    ];
    for (const { x, side, tag } of sides) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, PANELS.y, PANELS.width, PANELS.height);
      ctx.clip();
      ctx.translate(x, PANELS.y);
      scene.paint(ctx, side, PANELS.width, PANELS.height, createRandom(scene.seed));
      ctx.restore();
      ctx.strokeStyle = PALETTE.panelFrame;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, PANELS.y, PANELS.width, PANELS.height);
      ctx.fillStyle = 'rgba(12, 9, 5, 0.55)';
      roundRectPath(ctx, x + 10, PANELS.y + PANELS.height - 36, 62, 26, 6);
      ctx.fill();
      text(tag, x + 41, PANELS.y + PANELS.height - 17, 15, PALETTE.panelTag, 'center', 'bold');
    }
  }

  function drawFoundMarkers(game) {
    const scene = game.scene();
    for (const diff of scene.diffs) {
      if (!game.found.has(diff.id)) continue;
      for (const px of [PANELS.leftX, PANELS.rightX]) {
        const cx = px + diff.x;
        const cy = PANELS.y + diff.y;
        ctx.strokeStyle = PALETTE.found;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, diff.r + 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(88, 201, 107, 0.18)';
        ctx.beginPath();
        ctx.arc(cx, cy, diff.r + 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = PALETTE.found;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy);
        ctx.lineTo(cx - 2, cy + 6);
        ctx.lineTo(cx + 9, cy - 6);
        ctx.stroke();
      }
    }
  }

  function drawHintRing(game) {
    if (!game.hint || game.screen !== SCREEN_PLAY) return;
    const diff = game.scene().diffs.find((d) => d.id === game.hint.diffId);
    if (!diff) return;
    const phase = (performance.now() / 450) % 1;
    const radius = diff.r + 8 + phase * 12;
    ctx.save();
    ctx.strokeStyle = `rgba(255, 176, 32, ${1 - phase * 0.7})`;
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 7]);
    for (const px of [PANELS.leftX, PANELS.rightX]) {
      ctx.beginPath();
      ctx.arc(px + diff.x, PANELS.y + diff.y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawWrongFlash(game) {
    const flash = game.wrongFlash;
    if (!flash || game.now >= flash.until) return;
    const px = flash.panel === 0 ? PANELS.leftX : PANELS.rightX;
    const cx = px + flash.x;
    const cy = PANELS.y + flash.y;
    ctx.strokeStyle = PALETTE.wrong;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 12, cy - 12);
    ctx.lineTo(cx + 12, cy + 12);
    ctx.moveTo(cx + 12, cy - 12);
    ctx.lineTo(cx - 12, cy + 12);
    ctx.stroke();
  }

  function drawCrosshair(game) {
    if (!game.showCrosshair || game.screen !== SCREEN_PLAY) return;
    const px = game.crosshair.panel === 0 ? PANELS.leftX : PANELS.rightX;
    const cx = px + game.crosshair.x;
    const cy = PANELS.y + game.crosshair.y;
    ctx.strokeStyle = 'rgba(245, 239, 226, 0.95)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 21, cy);
    ctx.lineTo(cx - 9, cy);
    ctx.moveTo(cx + 9, cy);
    ctx.lineTo(cx + 21, cy);
    ctx.moveTo(cx, cy - 21);
    ctx.lineTo(cx, cy - 9);
    ctx.moveTo(cx, cy + 9);
    ctx.lineTo(cx, cy + 21);
    ctx.stroke();
  }

  function drawHeader(game) {
    ctx.fillStyle = PALETTE.header;
    ctx.fillRect(0, 0, FIELD.width, HEADER.height);
    const scene = game.scene();
    text('TWIN LANTERNS', 24, 30, 26, PALETTE.text, 'left', 'bold');
    text(`${scene.name}  ·  Round ${game.roundIndex + 1} of ${game.scenes.length}`, 24, 52, 14, PALETTE.muted, 'left');
    const total = scene.diffs.length;
    const found = game.found.size;
    const left = total - found;
    text(`FOUND ${found} / ${total}   ·   ${left} LEFT`, FIELD.width / 2, 42, 28, left === 0 ? PALETTE.found : PALETTE.text, 'center', 'bold');
    const low = game.timeLeft <= 30 && game.screen === SCREEN_PLAY;
    text(clock(game.timeLeft), 1010, 40, 30, low ? PALETTE.timerLow : PALETTE.timer, 'right', 'bold');
    text(`SCORE ${game.score}`, 1256, 40, 24, PALETTE.text, 'right', 'bold');
    // Timer bar under the header: drains with the round, red when it runs low.
    const fraction = Math.max(0, game.timeLeft / scene.timeLimit);
    ctx.fillStyle = '#3a2f1d';
    ctx.fillRect(0, HEADER.height, FIELD.width, 5);
    ctx.fillStyle = low ? PALETTE.timerLow : PALETTE.timer;
    ctx.fillRect(0, HEADER.height, FIELD.width * fraction, 5);
  }

  function drawFooter(game, muted) {
    ctx.fillStyle = PALETTE.header;
    ctx.fillRect(0, FOOTER.y, FIELD.width, FOOTER.height);
    ctx.fillStyle = PALETTE.button;
    roundRectPath(ctx, HINT_BUTTON.x, HINT_BUTTON.y, HINT_BUTTON.width, HINT_BUTTON.height, 10);
    ctx.fill();
    ctx.strokeStyle = PALETTE.buttonEdge;
    ctx.lineWidth = 2;
    roundRectPath(ctx, HINT_BUTTON.x, HINT_BUTTON.y, HINT_BUTTON.width, HINT_BUTTON.height, 10);
    ctx.stroke();
    const hintLabel = game.hintCooldown > 0
      ? `Hint … ${Math.ceil(game.hintCooldown)}s`
      : `Hint  (H)  ·  ${game.hintsLeft} left`;
    text(hintLabel, HINT_BUTTON.x + 16, HINT_BUTTON.y + 30, 17, PALETTE.text, 'left', 'bold');
    if (game.now < game.messageUntil && game.message) {
      text(game.message, FIELD.width / 2, FOOTER.y + 44, 19, PALETTE.text, 'center');
    }
    text(`Click a difference  ·  Arrows + Enter work too  ·  P pause  ·  M ${muted ? 'unmute' : 'mute'}`, 1256, FOOTER.y + 44, 14, PALETTE.muted, 'right');
  }

  function drawPanel(title, lines, prompt) {
    const width = 660;
    const height = 150 + lines.length * 34 + 70;
    const x = (FIELD.width - width) / 2;
    const y = (FIELD.height - height) / 2;
    ctx.fillStyle = PALETTE.overlay;
    ctx.fillRect(0, 0, FIELD.width, FIELD.height);
    ctx.fillStyle = '#2a2113';
    roundRectPath(ctx, x, y, width, height, 16);
    ctx.fill();
    ctx.strokeStyle = PALETTE.panelFrame;
    ctx.lineWidth = 3;
    roundRectPath(ctx, x, y, width, height, 16);
    ctx.stroke();
    text(title, FIELD.width / 2, y + 72, 44, PALETTE.text, 'center', 'bold');
    for (let i = 0; i < lines.length; i += 1) {
      text(lines[i], FIELD.width / 2, y + 128 + i * 34, 20, PALETTE.muted, 'center');
    }
    text(prompt, FIELD.width / 2, y + height - 36, 22, PALETTE.panelTag, 'center', 'bold');
  }

  function drawOverlay(game, best) {
    if (game.screen === SCREEN_TITLE) {
      drawPanel('TWIN LANTERNS', [
        'Two pictures, side by side — almost the same. Find every difference.',
        'Click a difference on either picture, or steer with the arrow keys and press Enter.',
        'A wrong click costs 15 points and 3 seconds. Hints cost 50 points.',
        'Round 1 · Sunny Garden — 5 differences · 3:00',
        'Round 2 · Lantern Night — 7 differences · 2:30',
        'Round 3 · Harbour Morning — 9 differences · 2:00',
        best > 0 ? `Best score: ${best}` : '',
      ].filter((line) => line !== ''), 'Press Space or click to start');
    } else if (game.screen === SCREEN_PAUSED) {
      drawPanel('Paused', ['The clock is stopped. Take a breath, look closely.'], 'Press P to keep hunting');
    } else if (game.screen === SCREEN_CLEAR) {
      const info = game.roundClearInfo || { bonus: 0, secondsLeft: 0 };
      const last = game.roundIndex + 1 < game.scenes.length;
      drawPanel('Round clear!', [
        `You found all ${game.scene().diffs.length} differences in ${game.scene().name}.`,
        `Time bonus: +${info.bonus}  (${info.secondsLeft}s to spare)`,
        `Score: ${game.score}`,
      ], last ? 'Press Space for the next round' : 'Press Space to see your victory');
    } else if (game.screen === SCREEN_OVER) {
      drawPanel('Out of time!', [
        `You found ${game.found.size} of ${game.scene().diffs.length} differences in ${game.scene().name}.`,
        `Score: ${game.score}   ·   Mistakes: ${game.mistakes}`,
      ], 'Press Space to retry this round');
    } else if (game.screen === SCREEN_WIN) {
      drawPanel('You found them all!', [
        `All ${game.foundTotal} differences across three rounds.`,
        `Final score: ${game.score}${game.score >= best && best > 0 ? ' — a new best!' : ''}`,
        best > 0 ? `Best score: ${Math.max(best, game.score)}` : '',
      ].filter((line) => line !== ''), 'Press Space to play again');
    }
  }

  /** Paint one frame: header, pictures, markers, footer, then any overlay. */
  function draw(game, best, muted) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PALETTE.backdrop;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    drawHeader(game);
    drawPanels(game);
    drawFoundMarkers(game);
    drawHintRing(game);
    drawWrongFlash(game);
    drawCrosshair(game);
    drawFooter(game, muted);
    drawOverlay(game, best);
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw };
}

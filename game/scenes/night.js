// Round 2 — Lantern Night. A festival street under a full moon: seven differences,
// smaller and sneakier than the garden's. paint() draws the left panel when side
// is 0 and the right panel, with the differences applied, when side is 1.
import { disc, ellipse, sparkle } from '../src/helpers.js';

const STARS = [
  [60, 60], [150, 40], [230, 90], [330, 50], [410, 130], [560, 150],
  [90, 260], [40, 330], [580, 230], [350, 180], [200, 160], [470, 200],
];
const FIREFLIES = [
  [90, 200], [150, 240], [250, 200], [320, 260], [520, 350], [80, 420],
];

function lantern(ctx, x, y, color) {
  ctx.fillStyle = 'rgba(255, 190, 80, 0.12)';
  disc(ctx, x, y + 14, 26, 'rgba(255, 190, 80, 0.12)');
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y + 14, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f2c94c';
  ctx.fillRect(x - 8, y - 10, 16, 5);
  ctx.fillRect(x - 8, y + 32, 16, 5);
  ctx.fillStyle = '#fff3c4';
  ctx.fillRect(x - 2, y + 2, 4, 22);
}

export const nightScene = {
  id: 'night',
  name: 'Lantern Night',
  sub: 'Round 2 · 7 differences · 2:30',
  timeLimit: 150,
  seed: 202,
  diffs: [
    { id: 'moon-crater', label: 'A crater on the moon', x: 515, y: 68, r: 14 },
    { id: 'lantern', label: "One lantern's colour", x: 270, y: 125, r: 24 },
    { id: 'window-light', label: 'A lit window', x: 180, y: 330, r: 22 },
    { id: 'plank', label: 'A plank on the bridge', x: 350, y: 470, r: 20 },
    { id: 'cat-tail', label: "The cat's tail", x: 395, y: 420, r: 24 },
    { id: 'firefly', label: 'A firefly', x: 90, y: 200, r: 14 },
    { id: 'bamboo-leaf', label: 'Bamboo leaves', x: 550, y: 300, r: 22 },
  ],

  paint(ctx, side, W, H) {
    const right = side === 1;

    // Night sky and stars.
    const sky = ctx.createLinearGradient(0, 0, 0, 560);
    sky.addColorStop(0, '#141c38');
    sky.addColorStop(1, '#2c3a5e');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    for (const [sx, sy] of STARS) sparkle(ctx, sx, sy, 4, '#ffffff');

    // The moon — the right picture has one crater more.
    disc(ctx, 500, 80, 40, '#f7ead0');
    disc(ctx, 488, 70, 6, '#e0cfae');
    disc(ctx, 512, 88, 8, '#e0cfae');
    disc(ctx, 495, 95, 5, '#e0cfae');
    if (right) disc(ctx, 515, 68, 6, '#e0cfae');

    // String of lanterns across the top.
    ctx.strokeStyle = '#0c1020';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, 92);
    ctx.lineTo(560, 92);
    ctx.stroke();
    const lanternXs = [90, 180, 270, 360, 450];
    for (const lx of lanternXs) {
      ctx.strokeStyle = '#0c1020';
      ctx.beginPath();
      ctx.moveTo(lx, 92);
      ctx.lineTo(lx, 104);
      ctx.stroke();
      if (lx === 270) lantern(ctx, lx, 104, right ? '#58c96b' : '#e5534b');
      else lantern(ctx, lx, 104, lx % 180 === 0 ? '#f2a541' : '#e5534b');
    }

    // Festival house, left: tiered roof, one window lit only on the left.
    ctx.fillStyle = '#232c4a';
    ctx.fillRect(90, 300, 170, 130);
    ctx.fillStyle = '#c65b4e';
    ctx.beginPath();
    ctx.moveTo(70, 302);
    ctx.lineTo(175, 240);
    ctx.lineTo(280, 302);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#c65b4e';
    ctx.beginPath();
    ctx.moveTo(100, 244);
    ctx.lineTo(175, 200);
    ctx.lineTo(250, 244);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = right ? '#141a2e' : '#ffd94d';
    ctx.fillRect(160, 310, 40, 40);
    ctx.fillStyle = '#bfe3ff';
    ctx.fillRect(210, 350, 30, 30);
    ctx.fillStyle = '#8a5a33';
    ctx.fillRect(130, 370, 36, 60);

    // Bamboo, right edge — one leaf cluster fewer on the right picture.
    ctx.strokeStyle = '#3f8f3a';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(566, 520);
    ctx.lineTo(566, 210);
    ctx.moveTo(588, 520);
    ctx.lineTo(588, 260);
    ctx.stroke();
    ctx.fillStyle = '#4da344';
    ellipse(ctx, 552, 250, 22, 8, '#4da344');
    ellipse(ctx, 580, 290, 24, 8, '#4da344');
    if (!right) {
      ellipse(ctx, 550, 300, 24, 9, '#4da344');
      ellipse(ctx, 540, 318, 18, 7, '#4da344');
    }

    // Fireflies drifting over the garden — one fewer on the right.
    for (const [fx, fy] of FIREFLIES) {
      if (fx === 90 && fy === 200 && right) continue;
      disc(ctx, fx, fy, 7, 'rgba(190, 255, 120, 0.25)');
      disc(ctx, fx, fy, 3, '#c8ff7a');
    }

    // Stream along the bottom and the little arched bridge.
    ctx.fillStyle = '#1d2f52';
    ctx.fillRect(0, 470, W, 90);
    ctx.strokeStyle = 'rgba(140, 190, 255, 0.5)';
    ctx.lineWidth = 2;
    for (const wy of [495, 520, 545]) {
      ctx.beginPath();
      ctx.moveTo(20, wy);
      ctx.quadraticCurveTo(200, wy - 8, 380, wy);
      ctx.quadraticCurveTo(500, wy + 8, 590, wy);
      ctx.stroke();
    }
    ctx.fillStyle = '#8a5a33';
    ctx.beginPath();
    ctx.moveTo(240, 505);
    ctx.quadraticCurveTo(360, 420, 480, 505);
    ctx.lineTo(480, 520);
    ctx.quadraticCurveTo(360, 440, 240, 520);
    ctx.closePath();
    ctx.fill();
    // Planks across the bridge — one missing on the right picture.
    ctx.strokeStyle = '#5b3a1e';
    ctx.lineWidth = 3;
    for (let px = 255; px <= 465; px += 30) {
      if (px === 345 && right) continue;
      const top = 468 - Math.abs(px - 360) * 0.12;
      ctx.beginPath();
      ctx.moveTo(px, top);
      ctx.lineTo(px, top + 42);
      ctx.stroke();
    }

    // The cat on the bridge — tail up on the left, tail down on the right.
    ctx.fillStyle = '#2b2b2b';
    ellipse(ctx, 420, 428, 22, 16, '#2b2b2b');
    disc(ctx, 436, 408, 13, '#2b2b2b');
    ctx.beginPath();
    ctx.moveTo(428, 398);
    ctx.lineTo(432, 388);
    ctx.lineTo(437, 397);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(440, 398);
    ctx.lineTo(444, 388);
    ctx.lineTo(448, 397);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2b2b2b';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (right) {
      ctx.moveTo(402, 430);
      ctx.quadraticCurveTo(392, 448, 400, 462);
    } else {
      ctx.moveTo(402, 430);
      ctx.quadraticCurveTo(388, 414, 396, 398);
    }
    ctx.stroke();
    disc(ctx, 440, 406, 2, '#ffd94d');
  },
};

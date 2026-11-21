// Round 1 — Sunny Garden. A cottage, a pond and an apple tree in daylight.
// Five differences, all fair-sized: a good first hunt. Panel space is 608x540 wide
// by 560 tall; paint() draws the left panel when side is 0 and the right panel,
// with the differences applied, when side is 1.
import { cloud, disc, ellipse, flower } from '../src/helpers.js';

export const gardenScene = {
  id: 'garden',
  name: 'Sunny Garden',
  sub: 'Round 1 · 5 differences · 3:00',
  timeLimit: 180,
  seed: 101,
  diffs: [
    { id: 'sun-rays', label: "The sun's rays", x: 78, y: 72, r: 46 },
    { id: 'window', label: 'The cottage window', x: 325, y: 315, r: 30 },
    { id: 'apple', label: 'An apple on the tree', x: 505, y: 205, r: 16 },
    { id: 'duck', label: 'The duck in the pond', x: 130, y: 468, r: 26 },
    { id: 'flower', label: "One flower's colour", x: 300, y: 520, r: 18 },
  ],

  paint(ctx, side, W, H) {
    const right = side === 1;

    // Sky and sun.
    const sky = ctx.createLinearGradient(0, 0, 0, 360);
    sky.addColorStop(0, '#8ec9ee');
    sky.addColorStop(1, '#d8f0e3');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 360);
    disc(ctx, 78, 72, 34, '#ffd94d');
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const rays = right ? 5 : 8;
    for (let i = 0; i < rays; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(78 + Math.cos(a) * 42, 72 + Math.sin(a) * 42);
      ctx.lineTo(78 + Math.cos(a) * 56, 72 + Math.sin(a) * 56);
      ctx.stroke();
    }
    cloud(ctx, 300, 70, 1, 'rgba(255,255,255,0.95)');
    cloud(ctx, 460, 112, 0.7, 'rgba(255,255,255,0.9)');

    // Rolling hills and grass: a grass base first, so no bare sky shows below the horizon.
    ctx.fillStyle = '#7ec850';
    ctx.fillRect(0, 360, W, 200);
    ctx.fillStyle = '#7ec850';
    ctx.beginPath();
    ctx.ellipse(140, 560, 330, 120, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6db844';
    ctx.beginPath();
    ctx.ellipse(480, 580, 340, 130, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8ed35e';
    ctx.fillRect(0, 470, W, 90);

    // Pond, bottom left — and its duck, which only the left picture has.
    ellipse(ctx, 120, 470, 95, 34, '#5fb7e8');
    ellipse(ctx, 120, 470, 78, 26, '#7cc8ef');
    if (!right) {
      ellipse(ctx, 130, 468, 20, 13, '#ffffff');
      disc(ctx, 148, 458, 9, '#ffffff');
      ctx.fillStyle = '#f2a541';
      ctx.beginPath();
      ctx.moveTo(156, 458);
      ctx.lineTo(168, 461);
      ctx.lineTo(156, 464);
      ctx.closePath();
      ctx.fill();
      disc(ctx, 146, 455, 2, '#222222');
    }

    // Fence across the middle.
    ctx.fillStyle = '#a9805a';
    ctx.fillRect(16, 398, 250, 8);
    ctx.fillRect(16, 424, 250, 8);
    for (const px of [24, 96, 168, 240]) ctx.fillRect(px, 388, 10, 52);

    // Cottage: walls, roof, door, two windows.
    ctx.fillStyle = '#f7e8c8';
    ctx.fillRect(290, 270, 180, 140);
    ctx.fillStyle = '#c65b4e';
    ctx.beginPath();
    ctx.moveTo(276, 272);
    ctx.lineTo(380, 192);
    ctx.lineTo(484, 272);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#8a5a33';
    ctx.fillRect(356, 330, 44, 80);
    disc(ctx, 392, 372, 3, '#ffd94d');
    // Left window: cross bars and yellow curtains on the left picture,
    // a plain dark pane on the right one.
    if (right) {
      ctx.fillStyle = '#2c3a4a';
      ctx.fillRect(306, 296, 40, 40);
    } else {
      ctx.fillStyle = '#ffe9a8';
      ctx.fillRect(306, 296, 40, 40);
      ctx.fillStyle = '#f2c94c';
      ctx.fillRect(306, 296, 8, 40);
      ctx.fillRect(338, 296, 8, 40);
      ctx.strokeStyle = '#8a5a33';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(326, 296);
      ctx.lineTo(326, 336);
      ctx.moveTo(306, 316);
      ctx.lineTo(346, 316);
      ctx.stroke();
    }
    ctx.fillStyle = '#bfe3ff';
    ctx.fillRect(416, 296, 40, 40);
    ctx.strokeStyle = '#8a5a33';
    ctx.lineWidth = 3;
    ctx.strokeRect(416, 296, 40, 40);
    ctx.beginPath();
    ctx.moveTo(436, 296);
    ctx.lineTo(436, 336);
    ctx.moveTo(416, 316);
    ctx.lineTo(456, 316);
    ctx.stroke();

    // Apple tree, right side — one apple fewer on the right picture.
    ctx.fillStyle = '#7a4a21';
    ctx.fillRect(512, 300, 20, 130);
    ctx.fillStyle = '#3f8f3a';
    disc(ctx, 500, 220, 70, '#3f8f3a');
    disc(ctx, 560, 250, 60, '#3f8f3a');
    disc(ctx, 520, 180, 55, '#4da344');
    disc(ctx, 470, 230, 12, '#e5534b');
    disc(ctx, 545, 235, 12, '#e5534b');
    disc(ctx, 520, 265, 12, '#e5534b');
    disc(ctx, 575, 270, 12, '#e5534b');
    if (!right) disc(ctx, 505, 205, 12, '#e5534b');

    // Mushroom by the tree and a butterfly up high.
    ctx.fillStyle = '#fff3dd';
    ctx.fillRect(550, 462, 10, 18);
    ctx.fillStyle = '#e5534b';
    ctx.beginPath();
    ctx.arc(555, 462, 16, Math.PI, 0);
    ctx.fill();
    disc(ctx, 549, 454, 3, '#ffffff');
    disc(ctx, 561, 458, 3, '#ffffff');
    ctx.fillStyle = '#f2a541';
    ellipse(ctx, 472, 106, 12, 7, '#f2a541');
    ellipse(ctx, 490, 106, 12, 7, '#f2a541');
    ctx.fillStyle = '#5b3a1e';
    ctx.fillRect(479, 100, 3, 14);

    // Flower bed along the bottom — one flower changes colour on the right.
    const bed = [250, 300, 350, 400, 450, 500, 550];
    for (const fx of bed) {
      if (fx === 300) flower(ctx, fx, 520, right ? '#9b7ede' : '#e5534b', '#ffd94d');
      else flower(ctx, fx, 520, fx % 100 === 0 ? '#f27ea9' : '#ffffff', '#ffd94d');
    }
  },
};

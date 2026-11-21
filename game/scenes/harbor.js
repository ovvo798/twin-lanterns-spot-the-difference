// Round 3 — Harbour Morning. Dawn over the docks: nine differences, the smallest
// and slyest of the three rounds. paint() draws the left panel when side is 0 and
// the right panel, with the differences applied, when side is 1.
import { disc, ellipse, gull } from '../src/helpers.js';

function sailboat(ctx, cx, waterY, scale, stripe) {
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath();
  ctx.moveTo(cx - 34 * scale, waterY);
  ctx.lineTo(cx + 34 * scale, waterY);
  ctx.lineTo(cx + 24 * scale, waterY + 16 * scale);
  ctx.lineTo(cx - 24 * scale, waterY + 16 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5b3a1e';
  ctx.fillRect(cx - 2 * scale, waterY - 62 * scale, 4 * scale, 62 * scale);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx + 3 * scale, waterY - 58 * scale);
  ctx.lineTo(cx + 3 * scale, waterY - 6 * scale);
  ctx.lineTo(cx + 34 * scale, waterY - 6 * scale);
  ctx.closePath();
  ctx.fill();
  if (stripe) {
    ctx.fillStyle = '#e5534b';
    ctx.beginPath();
    ctx.moveTo(cx + 3 * scale, waterY - 34 * scale);
    ctx.lineTo(cx + 3 * scale, waterY - 22 * scale);
    ctx.lineTo(cx + 20 * scale, waterY - 22 * scale);
    ctx.closePath();
    ctx.fill();
  }
}

export const harborScene = {
  id: 'harbor',
  name: 'Harbour Morning',
  sub: 'Round 3 · 9 differences · 2:00',
  timeLimit: 120,
  seed: 303,
  diffs: [
    { id: 'lighthouse-light', label: 'The lighthouse beam', x: 85, y: 115, r: 26 },
    { id: 'sail', label: 'A stripe on the sail', x: 435, y: 330, r: 26 },
    { id: 'gull', label: 'A gull in the sky', x: 430, y: 120, r: 16 },
    { id: 'crate', label: 'A crate on the pier', x: 535, y: 457, r: 22 },
    { id: 'buoy', label: "The buoy's colour", x: 200, y: 470, r: 18 },
    { id: 'flag', label: 'The flag on the mast', x: 155, y: 335, r: 20 },
    { id: 'rope', label: 'A coil of rope', x: 430, y: 517, r: 20 },
    { id: 'house-window', label: 'The harbour house window', x: 300, y: 265, r: 20 },
    { id: 'fish', label: 'A jumping fish', x: 380, y: 420, r: 18 },
  ],

  paint(ctx, side, W, H) {
    const right = side === 1;

    // Dawn sky, low sun, gulls — one gull fewer on the right picture.
    const sky = ctx.createLinearGradient(0, 0, 0, 300);
    sky.addColorStop(0, '#ffd9a0');
    sky.addColorStop(1, '#ffb08a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, 300);
    disc(ctx, 520, 70, 26, '#fff0b8');
    gull(ctx, 380, 90, 1, '#5b3a1e');
    if (!right) gull(ctx, 430, 120, 1, '#5b3a1e');
    gull(ctx, 340, 140, 0.8, '#5b3a1e');

    // Sea.
    const sea = ctx.createLinearGradient(0, 300, 0, 560);
    sea.addColorStop(0, '#3a7ca8');
    sea.addColorStop(1, '#2a5f8a');
    ctx.fillStyle = sea;
    ctx.fillRect(0, 300, W, 260);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    for (const wy of [330, 380, 440, 500]) {
      ctx.beginPath();
      ctx.moveTo(10, wy);
      ctx.quadraticCurveTo(180, wy - 6, 360, wy);
      ctx.quadraticCurveTo(500, wy + 6, 598, wy);
      ctx.stroke();
    }

    // Lighthouse, left — its beam shines only on the left picture.
    ctx.fillStyle = '#f5efe2';
    ctx.fillRect(62, 150, 46, 230);
    ctx.fillStyle = '#e5534b';
    ctx.fillRect(62, 190, 46, 30);
    ctx.fillRect(62, 270, 46, 30);
    ctx.fillRect(62, 340, 46, 30);
    ctx.fillStyle = '#2c3a4a';
    ctx.fillRect(70, 118, 30, 34);
    ctx.fillStyle = '#ffd94d';
    ctx.fillRect(76, 126, 18, 18);
    ctx.fillStyle = '#2c3a4a';
    ctx.beginPath();
    ctx.moveTo(64, 118);
    ctx.lineTo(85, 98);
    ctx.lineTo(106, 118);
    ctx.closePath();
    ctx.fill();
    if (!right) {
      ctx.fillStyle = 'rgba(255, 220, 120, 0.30)';
      ctx.beginPath();
      ctx.moveTo(100, 132);
      ctx.lineTo(320, 88);
      ctx.lineTo(320, 176);
      ctx.closePath();
      ctx.fill();
    }

    // Harbour house, centre — its window is open and bright on the left,
    // shuttered and dark on the right.
    ctx.fillStyle = '#f7e8c8';
    ctx.fillRect(250, 230, 110, 100);
    ctx.fillStyle = '#7a4a21';
    ctx.beginPath();
    ctx.moveTo(240, 232);
    ctx.lineTo(305, 182);
    ctx.lineTo(370, 232);
    ctx.closePath();
    ctx.fill();
    if (right) {
      ctx.fillStyle = '#2c3a4a';
      ctx.fillRect(285, 250, 30, 30);
      ctx.strokeStyle = '#8a5a33';
      ctx.lineWidth = 3;
      ctx.strokeRect(285, 250, 30, 30);
    } else {
      ctx.fillStyle = '#ffd94d';
      ctx.fillRect(285, 250, 30, 30);
      ctx.fillStyle = '#7ec850';
      ctx.fillRect(279, 250, 6, 30);
      ctx.fillRect(315, 250, 6, 30);
    }
    ctx.fillStyle = '#8a5a33';
    ctx.fillRect(330, 285, 22, 45);

    // Buoy — red on the left, yellow on the right.
    disc(ctx, 200, 470, 14, right ? '#ffd94d' : '#e5534b');
    ctx.fillStyle = '#f5efe2';
    ctx.fillRect(197, 452, 6, 10);
    disc(ctx, 200, 450, 4, '#f5efe2');

    // The two sailboats. The big one's sail has a red stripe only on the left.
    sailboat(ctx, 420, 360, 1, !right);
    sailboat(ctx, 140, 400, 0.7, false);
    // Flag on the small boat's mast — it points the other way on the right.
    ctx.fillStyle = '#e5534b';
    ctx.beginPath();
    if (right) {
      ctx.moveTo(148, 330);
      ctx.lineTo(128, 336);
      ctx.lineTo(148, 342);
    } else {
      ctx.moveTo(152, 330);
      ctx.lineTo(172, 336);
      ctx.lineTo(152, 342);
    }
    ctx.closePath();
    ctx.fill();

    // A fish jumping near the big boat — only splash rings on the right.
    if (right) {
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(380, 428, 16, 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(380, 428, 9, 3, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#5fb7e8';
      ctx.beginPath();
      ctx.ellipse(380, 416, 14, 7, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(392, 408);
      ctx.lineTo(402, 402);
      ctx.lineTo(398, 414);
      ctx.closePath();
      ctx.fill();
    }

    // Pier, bottom right: crates, and a rope coil only on the left picture.
    ctx.fillStyle = '#8a5a33';
    ctx.fillRect(380, 500, 228, 34);
    ctx.fillStyle = '#5b3a1e';
    for (const px of [396, 456, 516, 576]) ctx.fillRect(px, 534, 10, 26);
    ctx.fillStyle = '#c9a06a';
    ctx.fillRect(500, 466, 34, 34);
    ctx.fillRect(536, 466, 34, 34);
    ctx.strokeStyle = '#8a5a33';
    ctx.lineWidth = 2;
    ctx.strokeRect(500, 466, 34, 34);
    ctx.strokeRect(536, 466, 34, 34);
    if (!right) {
      ctx.fillStyle = '#c9a06a';
      ctx.fillRect(518, 432, 34, 34);
      ctx.strokeRect(518, 432, 34, 34);
    }
    if (!right) {
      ctx.strokeStyle = '#d9c08a';
      ctx.lineWidth = 4;
      for (const r of [6, 12, 18]) {
        ctx.beginPath();
        ctx.arc(430, 517, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ellipse(ctx, 430, 540, 30, 5, 'rgba(0,0,0,0.15)');
  },
};

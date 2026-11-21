// Small canvas drawing helpers shared by the scene painters and the renderer.
// Nothing here knows about the game rules; it only paints shapes.

/** Begin a rounded-rectangle path. */
export function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/** Fill a circle. */
export function disc(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Fill an ellipse. */
export function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** A soft four-point sparkle, for stars and fireflies. */
export function sparkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

/** A puffy cloud from three overlapping discs. */
export function cloud(ctx, x, y, scale, color) {
  disc(ctx, x, y, 22 * scale, color);
  disc(ctx, x + 24 * scale, y - 8 * scale, 26 * scale, color);
  disc(ctx, x + 50 * scale, y, 20 * scale, color);
  ctx.fillStyle = color;
  ctx.fillRect(x - 22 * scale, y, 72 * scale, 16 * scale);
}

/** A five-petal flower: stem, petals, centre. */
export function flower(ctx, x, y, petal, centre) {
  ctx.strokeStyle = '#2f7a33';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 16);
  ctx.stroke();
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
    disc(ctx, x + Math.cos(a) * 8, y + Math.sin(a) * 8, 7, petal);
  }
  disc(ctx, x, y, 6, centre);
}

/** A simple bird silhouette: two curved wings. */
export function gull(ctx, x, y, scale, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 12 * scale, y);
  ctx.quadraticCurveTo(x - 5 * scale, y - 8 * scale, x, y);
  ctx.quadraticCurveTo(x + 5 * scale, y - 8 * scale, x + 12 * scale, y);
  ctx.stroke();
}
